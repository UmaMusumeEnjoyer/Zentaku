import { useState, useEffect } from 'react';
import type { UseChatMessengerReturn, ChatRoom, Message, User } from './ChatApp.types';

const currentUser: User = { id: 'u0', name: 'You', avatar: 'https://i.pravatar.cc/150?u=u0', status: 'online', activity: 'Coding React' };
const userA: User = { id: 'u1', name: 'Người A', avatar: 'https://i.pravatar.cc/150?u=u1', status: 'online' };
const userB: User = { id: 'u2', name: 'Người B', avatar: 'https://i.pravatar.cc/150?u=u2', status: 'offline' };
const userC: User = { id: 'u3', name: 'Người C', avatar: 'https://i.pravatar.cc/150?u=u3', status: 'online' };
const hinaBeliever1: User = { id: 'u4', name: 'Con chiên số 1', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRodYuunyN6_G_-jdlB3NKhPpvzxn5LtzmGw&s', status: 'online' };
const hinaBeliever2: User = { id: 'u5', name: 'Simp chúa', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhS2XUjfwDVOdAWa950YEvNdNAsWaMB0z88g&s', status: 'online' };

const mockChatRooms: ChatRoom[] = [
  {
    id: 'c1',
    type: 'dm',
    name: 'Người A',
    members: [currentUser, userA],
    messages: [
      { id: 'm1', sender: userA, content: 'Alo em có phải X... không? Ui X... ơi em đừng có chối, thông tin về tên địa chỉ nhà, học trường gì, ở đâu, bố mẹ tên là gì anh có cả ở đây rồi. X... có cần anh đọc cho nghe một số thông tin không?...X ơi em còn trẻ quá, hơn con anh có mấy tuổi à, sao X... lại làm thế, còn cả tương lai đằng trước, X... thích anh cho người đến tận nhà nói chuyện với bố mẹ em đấy.', timestamp: '10:00 AM' }
    ]
  },
  {
    id: 'c2',
    type: 'dm',
    name: 'Người B',
    members: [currentUser, userB],
    messages: [
      { id: 'm2', sender: userB, content: 'Chào bạn, bạn có biết văn hóa của người Tày không? Trang phục chàm của họ rất đặc sắc và các điệu hát Then nghe cực kỳ cuốn hút đấy.', timestamp: 'Hôm qua' }
    ]
  },
  {
    id: 'c3',
    type: 'dm',
    name: 'Người C',
    members: [currentUser, userC],
    messages: [
      { id: 'm3', sender: userC, content: 'Đợt này mình đang ở Cao Bằng. Thời tiết mát mẻ lắm, lát mình định chạy xe ra Thác Bản Giốc và ghé suối Lê-nin, nước trong vắt luôn. Cậu có rảnh thì lên đây chơi nhé!', timestamp: '08:30 AM' }
    ]
  },
  {
    id: 'c4',
    type: 'server',
    name: 'Hội thánh mẫu Youmiya',
    description: 'Nơi tôn thờ và lan tỏa sự đáng yêu của Mẫu Hina',
    members: [currentUser, hinaBeliever1, hinaBeliever2],
    messages: [
      { id: 'm4', sender: hinaBeliever1, content: 'Hôm nay giọng của chị Hina lại cứu rỗi tâm hồn đầy tội lỗi của tôi...', timestamp: '11:00 AM' },
      { id: 'm5', sender: hinaBeliever2, content: 'Amen! Nụ cười của chị trên stream tối qua làm tôi thức trắng đêm. Thật là một phước lành từ đấng cứu thế.', timestamp: '11:05 AM' },
      { id: 'm6', sender: currentUser, content: 'Tuyệt vời quá! Đang đợi project mới của chị iu ra mắt để cúng tiền đây.', timestamp: '11:10 AM' }
    ]
  }
];

export const useChatMessenger = (): UseChatMessengerReturn => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[] | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string>('c4');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setChatRooms(mockChatRooms);
      } catch (err) {
        setError(new Error('Failed to load chats'));
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  const activeRoom = chatRooms?.find(room => room.id === activeRoomId) || null;

  const sendMessage = (content: string) => {
    if (!chatRooms || !activeRoomId || !content.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatRooms(prev => prev?.map(room => 
      room.id === activeRoomId 
        ? { ...room, messages: [...room.messages, newMessage] } 
        : room
    ) || null);
  };

  return { chatRooms, activeRoom, loading, error, setActiveRoomId, sendMessage };
};