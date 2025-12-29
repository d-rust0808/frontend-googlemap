# Script để xóa node_modules khỏi git cache
# Chạy script này nếu node_modules đã được track trong git trước đó

Write-Host "Đang xóa node_modules khỏi git cache..." -ForegroundColor Yellow

# Xóa node_modules khỏi git index (không xóa file thực tế)
git rm -r --cached node_modules 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Đã xóa node_modules khỏi git cache" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tiếp theo, bạn cần commit thay đổi:" -ForegroundColor Cyan
    Write-Host "  git add .gitignore" -ForegroundColor White
    Write-Host "  git commit -m 'Add .gitignore and remove node_modules from git'" -ForegroundColor White
} else {
    Write-Host "✗ Có lỗi xảy ra hoặc node_modules chưa được track trong git" -ForegroundColor Red
}

Write-Host ""
Write-Host "Kiểm tra trạng thái:" -ForegroundColor Cyan
git status --short | Select-Object -First 10

