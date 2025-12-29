# Hướng dẫn sửa lỗi Git Push Permission Denied

## Vấn đề
- Bạn đang đăng nhập với tài khoản `locphamnguyen` nhưng repo thuộc `d-rust0808`
- Lỗi 403: Permission denied

## Giải pháp

### Cách 1: Xóa credentials cũ và đăng nhập lại (Khuyến nghị)

#### Bước 1: Xóa credentials cũ trong Windows

1. Mở **Windows Credential Manager**:
   - Nhấn `Win + R`
   - Gõ: `control /name Microsoft.CredentialManager`
   - Hoặc vào: Control Panel > Credential Manager > Windows Credentials

2. Tìm và xóa các entry liên quan đến GitHub:
   - `git:https://github.com`
   - `github.com`

#### Bước 2: Đăng nhập lại với đúng tài khoản

Khi push lần sau, Windows sẽ hỏi đăng nhập lại. Đăng nhập với tài khoản `d-rust0808`.

### Cách 2: Dùng Personal Access Token (PAT)

1. Tạo Personal Access Token trên GitHub:
   - Vào: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Chọn quyền: `repo` (full control)
   - Copy token

2. Khi push, dùng token thay vì password:
   ```
   Username: d-rust0808
   Password: <paste-token-here>
   ```

### Cách 3: Đổi sang SSH (An toàn nhất)

#### Bước 1: Tạo SSH key (nếu chưa có)
```powershell
ssh-keygen -t ed25519 -C "d.rust0808@gmail.com"
```

#### Bước 2: Thêm SSH key vào GitHub
```powershell
# Copy public key
cat ~/.ssh/id_ed25519.pub
# Hoặc trên Windows:
Get-Content ~/.ssh/id_ed25519.pub
```

- Vào: https://github.com/settings/keys
- Click "New SSH key"
- Paste key vào

#### Bước 3: Đổi remote URL sang SSH
```powershell
git remote set-url origin git@github.com:d-rust0808/frontend-googlemap.git
```

#### Bước 4: Test SSH connection
```powershell
ssh -T git@github.com
```

### Cách 4: Dùng Git Credential Manager (GCM)

```powershell
# Cài đặt GCM
winget install Microsoft.GitCredentialManager

# Hoặc download từ:
# https://github.com/GitCredentialManager/git-credential-manager/releases
```

Sau khi cài, khi push sẽ tự động mở browser để đăng nhập.

## Kiểm tra sau khi fix

```powershell
git remote -v
git push origin main
```

