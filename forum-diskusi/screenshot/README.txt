# Screenshot bukti CI/CD dan Branch Protection
#
# Wajib ada 3 file berikut saat mengumpulkan ZIP submission:
# - 1_ci_check_error.png : PR dengan CI merah (pengujian gagal) + "Merging is blocked"
# - 2_ci_check_pass.png  : PR dengan CI hijau "All checks have passed" + "Merging is blocked"
# - 3_branch_protection.png : bukti branch protection (require status check + require review)
#
# Cara menghasilkan (ringkas):
# 1. Push repo ini ke GitHub (public), hubungkan ke Vercel (Root Directory = forum-diskusi).
# 2. Di GitHub: Settings > Branches > Add rule untuk main/master:
#    - Require a pull request before merging (required approvals = 1)
#    - Require status checks to pass (pilih "automation-test-job" + "Vercel")
# 3. Buat branch baru, buat 1 test sengaja gagal, push, buka PR -> screenshot 1_ci_check_error.png
# 4. Perbaiki test hingga hijau, push lagi -> screenshot 2_ci_check_pass.png
# 5. Screenshot halaman PR yang menunjukkan "Merging is blocked" -> 3_branch_protection.png
#
# Lihat PANDUAN-SUBMISSION-2.md di root untuk langkah lengkap.
