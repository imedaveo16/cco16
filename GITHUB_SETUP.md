# تعليمات رفع المشروع على GitHub

## الخطوة 1: إنشاء مستودع GitHub جديد

1. اذهب إلى [GitHub.com](https://github.com)
2. انقر على **+** في الركن العلوي اليمين
3. اختر **New repository**
4. أدخل المعلومات التالية:
   - **Repository name**: `dgpc-mission-control`
   - **Description**: `منصة القيادة والتحكم v1.1 - الحماية المدنية الجزائرية`
   - **Visibility**: اختر **Private** (موصى به للمشروع الرسمي)
   - **Initialize this repository**: ❌ لا تُفعل أي خيار (نحن سرفع الملفات الموجودة)
5. انقر **Create repository**

## الخطوة 2: ربط المستودع المحلي بـ GitHub

بعد إنشاء المستودع الجديد، ستحصل على عنوان مثل:
```
https://github.com/YOUR_USERNAME/dgpc-mission-control.git
```

ثم قم بتنفيذ الأمر التالي:

```bash
# استبدل YOUR_USERNAME باسم المستخدم الخاص بك في GitHub
git remote add origin https://github.com/YOUR_USERNAME/dgpc-mission-control.git

# التحقق من الربط
git remote -v
```

## الخطوة 3: رفع الكود إلى GitHub

### الخيار A: رفع على الفرع الرئيسي (main/master)

```bash
# رفع الكود
git push -u origin master

# أو إذا كنت تريد تسمية الفرع main
git branch -M main
git push -u origin main
```

### الخيار B: رفع على فرع جديد (موصى به للإصدارات)

```bash
# إنشاء فرع للإصدار v1.1
git checkout -b v1.1-nasa-ar

# رفع الفرع
git push -u origin v1.1-nasa-ar
```

## الخطوة 4: إنشاء علامة الإصدار (Tag)

بعد رفع الكود بنجاح، قم بإنشاء علامة الإصدار:

```bash
# إنشاء علامة v1.1-nasa-ar مع رسالة
git tag -a v1.1-nasa-ar -m "v1.1 - NASA Style with Firebase Integration"

# رفع العلامة إلى GitHub
git push origin v1.1-nasa-ar

# أو رفع جميع العلامات
git push origin --tags
```

## الخطوة 5: التحقق على GitHub

1. اذهب إلى المستودع الخاص بك على GitHub
2. تأكد من رؤية جميع الملفات والمجلدات
3. تحقق من وجود علامة الإصدار (Tag) v1.1-nasa-ar

## أمثلة الأوامر الكاملة

### الإعداد والرفع على main

```bash
# 1. إضافة ملفات Git (إذا لم يكن مضافاً)
git add -A

# 2. إنشاء التزام (إذا لم يكن موجوداً)
git commit -m "feat: DGPC Mission Control v1.1 - NASA Style with Firebase Integration"

# 3. إعادة تسمية الفرع إلى main (اختياري)
git branch -M main

# 4. إضافة مستودع GitHub البعيد (استبدل YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/dgpc-mission-control.git

# 5. رفع الكود
git push -u origin main
```

### الإعداد والرفع على فرع الإصدار

```bash
# 1. إضافة ملفات Git (إذا لم يكن مضافاً)
git add -A

# 2. إنشاء التزام (إذا لم يكن موجوداً)
git commit -m "feat: DGPC Mission Control v1.1 - NASA Style with Firebase Integration"

# 3. إنشاء فرع للإصدار
git checkout -b v1.1-nasa-ar

# 4. إضافة مستودع GitHub البعيد (استبدل YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/dgpc-mission-control.git

# 5. رفع الفرع
git push -u origin v1.1-nasa-ar

# 6. إنشاء علامة الإصدار
git tag -a v1.1-nasa-ar -m "v1.1 - NASA Style with Firebase Integration"

# 7. رفع العلامة
git push origin v1.1-nasa-ar
```

## ملاحظات مهمة

### 1. استخدام GitHub CLI (اختياري)

إذا كنت تستخدم GitHub CLI، يمكنك إنشاء المستودع مباشرة:

```bash
# تسجيل الدخول (إن لم تكن مسجلاً)
gh auth login

# إنشاء مستودع جديد (خاص)
gh repo create dgpc-mission-control --private --description "منصة القيادة والتحكم v1.1 - الحماية المدنية الجزائرية"

# إضافة الربط
git remote add origin git@github.com:YOUR_USERNAME/dgpc-mission-control.git

# رفع الكود
git push -u origin master
```

### 2. استخدام SSH (اختياري - أكثر أماناً)

إذا كنت تستخدم SSH مع GitHub:

```bash
# إضافة مستودع باستخدام SSH
git remote add origin git@github.com:YOUR_USERNAME/dgpc-mission-control.git

# رفع الكود
git push -u origin master
```

### 3. تحديث .gitignore قبل الرفع

تأكد من وجود ملف `.gitignore` لتجنب رفع الملفات غير المرغوبة:
- `node_modules/`
- `.next/`
- `.env.local` (بما فيه مفتاح API)
- `firebase-debug.log*`
- الملفات المؤقتة والسجلات

### 4. حماية المفاتيح الحساسة

تأكد من أن ملف `.env.local` موجود في `.gitignore` ولا يتم رفعه:
- مفتاح Firebase API
- كلمات مرور قاعدة البيانات
- أي مفاتيح سرية أخرى

## استكشاف الأخطاء

### خطأ: Authentication failed

**الحل**:
```bash
# استخدم GitHub CLI للتصديق
gh auth login

# أو استخدم Personal Access Token
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/dgpc-mission-control.git
```

### خطأ: ! [rejected] master -> master (fetch first)

**الحل**:
```bash
# اسحب التغييرات من المستودع البعيد أولاً
git pull origin master --rebase

# ثم حاول الرفع مرة أخرى
git push origin master
```

### خطأ: ! [rejected] master -> master (non-fast-forward)

**الحل**:
```bash
# فرض الرفع (احذر عند الاستخدام)
git push origin master --force

# أو أفضل: دمج التغييرات
git pull origin master
git push origin master
```

---

## ✅ بعد الرفع بنجاح

1. تحقق من وجود جميع الملفات على GitHub
2. تأكد من وجود علامة الإصدار v1.1-nasa-ar
3. تحقق من README.md في الصفحة الرئيسية للمستودع
4. يمكنك الآن مشاركة رابط المستودع مع الفريق

---

**تذكير**: استبدل `YOUR_USERNAME` باسم المستخدم الفعلي الخاص بك في GitHub!
