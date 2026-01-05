// src/pages/components/EditProfileModal.js
import React, { useState, useEffect, useRef } from 'react';
import './EditProfileModal.css';
import { updateUserProfile, uploadUserAvatar, deleteUserAvatar } from '../../../services/api'; 

const EditProfileModal = ({ isOpen, onClose, currentUser, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fileInputRef = useRef(null);

    // [FIX] Sửa logic useEffect: Chỉ reset form khi Modal MỞ ra (isOpen = true)
    // Bỏ currentUser ra khỏi dependency array để tránh việc upload avatar (làm currentUser thay đổi) 
    // kích hoạt lại hàm này và reset các trường text đang nhập dở.
    useEffect(() => {
        if (isOpen && currentUser) {
            setFormData({
                first_name: currentUser.first_name || '',
                last_name: currentUser.last_name || '',
                username: currentUser.username || ''
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- LOGIC UPLOAD AVATAR ---
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setError("Image size should be less than 2MB.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await uploadUserAvatar(file);
            
            // Cập nhật UI cha (ProfilePage/Header) với avatar mới
            // Lưu ý: Text fields (first_name...) ở UI cha vẫn là dữ liệu cũ cho đến khi bấm Save
            // Nhưng formData cục bộ ở đây vẫn được giữ nguyên nhờ việc sửa useEffect ở trên
            onUpdateSuccess({ 
                ...currentUser, 
                avatar_url: res.data.avatar_url 
            });
            
        } catch (err) {
            console.error("Upload failed:", err);
            setError("Failed to upload avatar.");
        } finally {
            setLoading(false);
            e.target.value = null;
        }
    };

    // --- LOGIC DELETE AVATAR ---
    const handleAvatarDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            await deleteUserAvatar();

            onUpdateSuccess({ 
                ...currentUser, 
                avatar_url: null 
            });
            
        } catch (err) {
            console.error("Delete failed:", err);
            setError("Failed to delete avatar.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await updateUserProfile(formData);
            if (res.data && res.data.user) {
                onUpdateSuccess(res.data.user);
                onClose();
            }
        } catch (err) {
            console.error("Update failed:", err);
            setError("Failed to update profile. Username might be taken.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="edit-modal-overlay" onClick={onClose}>
            <div className="edit-modal-content" onClick={e => e.stopPropagation()}>
                <div className="edit-modal-header">
                    <h3 className="edit-modal-title">Edit Profile</h3>
                    <button className="btn-close-modal" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="edit-modal-body">
                        {error && <div className="error-msg">{error}</div>}
                        
                        {/* Khu vực Avatar */}
                        <div className="avatar-section">
                            <label className="avatar-label">Profile Picture</label>
                            <div className="avatar-actions">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    style={{ display: 'none' }} 
                                    accept="image/png, image/jpeg, image/gif, image/webp"
                                    onChange={handleFileChange}
                                />
                                
                                <button 
                                    type="button" 
                                    className="btn-avatar-action" 
                                    onClick={handleUploadClick}
                                    disabled={loading}
                                >
                                    Upload new picture
                                </button>
                                
                                <button 
                                    type="button" 
                                    className="btn-avatar-action btn-avatar-delete" 
                                    onClick={handleAvatarDelete}
                                    disabled={loading || !currentUser?.avatar_url}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Các trường thông tin */}
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input 
                                type="text" 
                                name="first_name" 
                                className="form-input"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input 
                                type="text" 
                                name="last_name" 
                                className="form-input"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input 
                                type="text" 
                                name="username" 
                                className="form-input"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            <div style={{fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px'}}>
                                Changing username may affect your profile link.
                            </div>
                        </div>
                    </div>

                    <div className="edit-modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Saving...' : 'Save profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;