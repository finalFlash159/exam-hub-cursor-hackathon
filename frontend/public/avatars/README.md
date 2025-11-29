# Avatar Collection

Thư mục này chứa các avatar mẫu cho người dùng chọn.

## 📁 Cấu trúc hiện tại

Hiện có **23 avatars** được đánh số từ `001` đến `023`:
- `avatar-001.jpg` đến `avatar-023.jpg`
- Format: JPG
- Kích thước khuyến nghị: 200x200px

## 🎨 Cách thêm avatar mới

1. **Đặt tên file theo format:**
   ```
   avatar-XXX.jpg
   ```
   Trong đó XXX là số thứ tự có padding 3 chữ số (001, 002, 003, ...)

2. **Kích thước và format:**
   - Kích thước: 200x200px (hoặc tỷ lệ 1:1)
   - Format hỗ trợ: JPG, PNG, WebP
   - Dung lượng: < 100KB mỗi file

3. **Vị trí lưu:**
   ```
   exam-app/public/avatars/avatar-XXX.jpg
   ```

## 🔧 Cách hoạt động

### Frontend (Auto-detection)
Component `AvatarPicker.jsx` tự động quét và phát hiện tất cả các file avatar có trong thư mục này bằng cách:

1. **Scanning patterns**: Thử nhiều format số (001, 01, 1, 0001)
2. **Image validation**: Kiểm tra file có tồn tại bằng cách load image
3. **Smart sorting**: Sắp xếp theo số thứ tự

**Ưu điểm:**
- Không cần config thủ công
- Thêm/xóa avatar chỉ cần thao tác file
- Tự động cập nhật khi deploy

### Backend (Database)
Khi user chọn avatar:

1. **Path được lưu**: `/avatars/avatar-XXX.jpg`
2. **Database field**: `users.avatar` (VARCHAR 500)
3. **API endpoint**: `PUT /auth/profile`
4. **Request body**:
   ```json
   {
     "avatar": "/avatars/avatar-001.jpg",
     "full_name": "User Name",
     "phone": "+84...",
     "bio": "..."
   }
   ```

## 📝 Lưu ý quan trọng

### ✅ Nên làm:
- Sử dụng ảnh có kích thước đồng nhất (1:1 ratio)
- Tối ưu dung lượng ảnh trước khi thêm
- Đặt tên file theo đúng format với padding số
- Test avatar mới bằng cách load trang Profile/Settings

### ❌ Không nên:
- Dùng ảnh quá lớn (> 500KB)
- Thay đổi tên file của avatar đã có (sẽ làm mất avatar của users)
- Xóa avatar đang được sử dụng bởi users

## 🚀 Sử dụng trong code

### ProfilePage.jsx
```jsx
// User click vào avatar → Mở menu
// Chọn "Chọn avatar có sẵn" → AvatarPicker modal
// User chọn avatar → Save → API call
```

### SettingsPage.jsx
```jsx
// Tương tự ProfilePage
// Có cả option "Tải ảnh lên" (disabled - chưa hỗ trợ)
```

### AvatarPicker.jsx
```jsx
// Tự động scan thư mục avatars
// Hiển thị grid 4 columns
// Preview avatar đã chọn
// Callback onAvatarSelect(path)
```

## 🔄 Sync với Backend

### Flow hoàn chỉnh:
1. **User chọn avatar** → Local preview update (`avatarPreview` state)
2. **User click "Lưu"** → Call API `authAPI.updateProfile()`
3. **Backend lưu DB** → Trả về updated user object
4. **Frontend update** → `updateUser()` trong AuthContext
5. **LocalStorage sync** → Avatar persist across sessions

### API Schema:
```python
# Backend: app/schemas/auth_schemas.py
class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = Field(None, max_length=255)
    avatar: Optional[str] = Field(None, max_length=500)  # Avatar path
    phone: Optional[str] = Field(None, max_length=20)
    bio: Optional[str] = Field(None, max_length=500)
```

## 📊 Current Status

- ✅ Frontend: AvatarPicker component hoàn chỉnh
- ✅ Backend: API endpoint sẵn sàng
- ✅ Database: Field `avatar` có trong model User
- ✅ Sync: AuthContext update local + backend
- ⚠️ Upload file: Chưa hỗ trợ (cần backend upload service)

## 🎯 Tính năng tương lai

- [ ] Upload custom avatar (cần backend upload API)
- [ ] Crop/resize ảnh trước khi upload
- [ ] Avatar categories (business, cartoon, anime, ...)
- [ ] Generate avatar từ tên (like GitHub Identicons)
- [ ] Avatar cache và CDN integration