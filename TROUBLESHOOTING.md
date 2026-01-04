# دليل الإصلاح - DGPC Mission Control v1.1

## 🚨 الأخطاء المعروفة والحلول

### خطأ: تكوين Firebase

**الأعراض**:
```
Error: Firebase is not configured. Add "firebaseConfig" to firebase.initializeApp()
```

**السبب**: Firebase Auth لم يتم تهيئته بمشروع `civilprotectiondz` الحقيقي

**الحل**:
1. تأكد من وجود ملف `.env.local` مع التكوين الحقيقي:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyC7LDpc2gAmUNdLDSutsYm6VbDK6JBW4BE"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="civilprotectiondz.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="civilprotectiondz"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="civilprotectiondz.appspot.com"
NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://civilprotectiondz-default-rtdb.europe-west1.firebasedatabase.app"
```

2. إعادة تشغيل الخادم بعد إضافة المتغيرات:
```bash
# إيقاف الخادم (Ctrl+C)
# حذف الذاكرة المؤقتة
rm -rf /home/z/my-project/.next

# إعادة التشغيل
bun run dev
```

### خطأ: Firebase Authentication Disabled

**الأعراض**:
```
Error: Firebase Authentication is not enabled for this project
```

**السبب**: Firebase Authentication لم يتم تفعيله في مشروع `civilprotectiondz`

**الحل**:
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/project/civilprotectiondz/authentication)
2. تأكد من **Sign-in method** مُفعّل
3. فعّل **Email/Password** provider:
   - انقر على **Email/Password**
   - انقر **Enable**
   - انقر **Save**
4. اختياري: فعّل **Email link**:
   - انقر على **Email link (passwordless sign-in)**
   - انقر **Enable**
   - انقر **Save**
5. إعادة تشغيل التطبيق

### خطأ: Firestore Database Not Found

**الأعراض**:
```
Error: Firestore is not enabled for this project
```

**السبب**: لم يتم إنشاء Firestore Database في مشروع `civilprotectiondz`

**الحل**:
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/project/civilprotectiondz/firestore)
2. انقر **Create database**
3. اختر المنطقة: **europe-west1**
4. اختر وضع البدء: **Start in Test Mode**
5. انقر **Enable**
6. نشر قواعد Firestore:
```bash
firebase deploy --only firestore:rules
```

### خطأ: Realtime Database Not Found

**الأعراض**:
```
Error: Realtime Database is not enabled for this project
```

**السبب**: لم يتم إنشاء Realtime Database في مشروع `civilprotectiondz`

**الحل**:
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/project/civilprotectiondz/database)
2. انقر **Create database**
3. اختر المنطقة: **europe-west1**
4. اختر وضع الأمان: **Start in Test Mode**
5. انقر **Enable**
6. نشر قواعد Realtime Database:
```bash
firebase deploy --only database
```

### خطأ: Firestore Rules Error

**الأعراض**:
```
Error: Error: Missing or insufficient permissions for Firestore
```

**السبب**: قواعد Firestore لا تسمح بالوصول

**الحل**:
1. افتح ملف `firestore.rules`:
```bash
cat /home/z/my-project/firestore.rules
```

2. تأكد من وجود وظائف مساعدة صحيحة:
- `isOwner(userId)`
- `isAdmin()`
- `isCommander()`
- `isSupervisor()`
- `isOperator()`

3. نشر القواعد:
```bash
firebase deploy --only firestore:rules
```

4. إنشاء مستخدمين اختبارية في Firebase Console

### خطأ: ZAI SDK Not Found

**الأعراض**:
```
Error: ZAI is not defined
```

**السبب**: ZAI SDK لم يتم تثبيته أو تم تثبيت إصدار خاطئ

**الحل**:
```bash
# إزالة إصدار ZAI القديم (إن وجد)
# ZAI SDK هو pre-installed عبر z-ai-web-dev-sdk

# إعادة تثبيت الاعتماديات
bun install

# التحقق من وجود z-ai-web-dev-sdk
ls node_modules/z-ai-web-dev-sdk
```

### خطأ: Next.js Build Error with Firebase

**الأعراض**:
```
Error: Module not found: Can't resolve 'firebase/app'
```

**السبب**: Firebase SDK لم يتم تثبيته

**الحل**:
```bash
# تثبيت Firebase SDK
bun install firebase

# حذف الذاكرة المؤقتة
rm -rf /home/z/my-project/.next

# إعادة البناء
bun run build
```

### خطأ: CORS Error with Firebase

**الأعراض**:
```
Access to fetch at 'https://civilprotectiondz.firebaseio.com' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**السبب**: قواعد Realtime Database لا تسمب بالوصول من localhost

**الحل**:
1. تحقق من ملف `database.rules.json`:
```json
".read": false,
".write": false,
"users": {
  ".read": "auth != null",
  // ...
}
```

2. نشر القواعد:
```bash
firebase deploy --only database
```

3. تأكد من تسجيل الدخول في التطبيق قبل محاولة الوصول للبيانات

---

## 🔧 نصائح الاستكشاف العامة

### مشاكل التجميع (Build Issues)

1. **مسح الذاكرة المؤقتة دائمًا**:
   ```bash
   rm -rf /home/z/my-project/.next
   rm -rf /home/z/my-project/node_modules/.cache
   ```

2. **تأكد من جميع الاعتماديات مثبتة**:
   ```bash
   bun install
   ```

3. **تحقق من إصدارات Node.js و Bun**:
   ```bash
   bun --version
   node --version
   ```

4. **تحقق من وجود ملف .env.local**:
   ```bash
   ls -la /home/z/my-project/.env.local
   ```

### مشاكل وقت التشغيل (Runtime Issues)

1. **تحقق من سجلات المتصفح**:
   - افتح Developer Tools (F12)
   - راجع Console و Network
   - تحقق من أخطاء Firebase (تم تحديدها في لون أحمر في Console)

2. **تحقق من سجلات الخادم**:
   ```bash
   tail -f /home/z/my-project/dev.log
   ```

3. **تحقق من سجلات Firebase**:
   - Firebase Console → Authentication → Logs
   - Firebase Console → Firestore → Usage
   - Firebase Console → Realtime Database → Usage

### مشاكل المصادقة

1. **فشل تسجيل الدخول**:
   - تحقق من صحة البريد الإلكتروني وكلمة المرور
   - تأكد من Firebase Auth مُفعّل
   - تأكد من Email/Password provider مُفعّل
   - راجع Firebase Console → Authentication → Users

2. **خطأ المستخدم غير موجود**:
   - تأكد من وجود المستخدم في Firebase Auth
   - إنشاء مستخدم في Firebase Console إذا لم يكن موجودًا
   - تحقق من صحة البريد الإلكتروني

3. **خطأ كلمة المرور الخاطئة**:
   - استخدم **Reset Password** في Firebase Console
   - أو أنشئ مستخدم جديد بكلمة مرور معروفة

---

## 🌐 مشاكل Firebase الحقيقية

### إعداد Firebase Authentication للمشروع civilprotectiondz

1. **الذهاب إلى Firebase Console**:
   - اذهب إلى [https://console.firebase.google.com/project/civilprotectiondz/authentication](https://console.firebase.google.com/project/civilprotectiondz/authentication)

2. **تفعيل Email/Password Provider**:
   - انقر على **Sign-in method**
   - انقر على **Email/Password**
   - انقر **Enable**
   - انقر **Save**

3. **إنشاء المستخدم الأول**:
   - انقر على **Users** tab
   - انقر **Add user**
   - أدخل:
     - **Email**: `admin@civilprotection.dz`
     - **Password**: `password123`
     - **Display name**: `مسؤول النظام`
   - انقر **Add user**

4. **تفعيل Email Verification (اختياري)**:
   - انقر على **Templates** tab
   - انقر على **Email address verification**
   - تخصيص القالب (استخدم العربية)
   - انقر **Save**

### إعداد Firestore Database للمشروع civilprotectiondz

1. **الذهاب إلى Firestore Console**:
   - اذهب إلى [https://console.firebase.google.com/project/civilprotectiondz/firestore](https://console.firebase.google.com/project/civilprotectiondz/firestore)

2. **إنشاء Database**:
   - إذا لم يكن موجودًا، انقر **Create database**
   - اختر المنطقة: **europe-west1**
   - اختر وضع البدء: **Start in Test Mode**
   - انقر **Enable**

3. **نشر قواعد Firestore**:
   ```bash
   firebase deploy --only firestore:rules
   ```

4. **إنشاء المستخدم في Firestore Users Collection**:
   - في Firestore Console، اختر **Start collection**
   - أدخل اسم المجموعة: `users`
   - أدخل معرف المستخدم (يمكنك نسخه من Firebase Auth)
   - إضافة المستند التالي:
   ```json
   {
     "uid": "firebase-uid-here",
     "email": "admin@civilprotection.dz",
     "name": "مسؤول النظام",
     "role": "ADMINISTRATOR",
     "centerId": "مركز 01",
     "isShadowMode": false,
     "isDrillMode": false,
     "mfaEnabled": false,
     "lastLogin": "2024-01-04T12:00:00.000Z",
     "createdAt": "2024-01-04T12:00:00.000Z"
   }
   ```
   - انقر **Save**

### إعداد Realtime Database للمشروع civilprotectiondz

1. **الذهاب إلى Realtime Database Console**:
   - اذهب إلى [https://console.firebase.google.com/project/civilprotectiondz/database](https://console.firebase.google.com/project/civilprotectiondz/database)

2. **إنشاء Database**:
   - إذا لم يكن موجودًا، انقر **Create database**
   - اختر المنطقة: **europe-west1**
   - اختر وضع الأمان: **Start in Test Mode**
   - انقر **Enable**

3. **نشر قواعد Realtime Database**:
   ```bash
   firebase deploy --only database
   ```

4. **إنشاء بنية البيانات الأساسية**:
   - في Realtime Database Console، أنشئ المفاتيح التالية:
     - `users/`
     - `incidents/`
     - `units/`
     - `communications/`
     - `decisions/`
     - `alerts/`
     - `audit_logs/`
     - `statistics/`

---

## 📞 الحصول على دعم إضافي

### معلومات النظام عند طلب الدعم

عند طلب دعم، يرجى توفير:
- إصدار Node.js و Bun
- نظام التشغيل
- الخطأ الكامل (مع Stack Trace إن أمكن)
- الخطوات التي قمت بها قبل حدوث الخطأ
- لقطة شاشة من المتصفح (إن أمكن)
- معلومات Firebase (Project ID, API Key - حجب المفتاح)

### قنوات الدعم

1. **سجلات الأخطاء**: `/home/z/my-project/dev.log`
2. **سجلات WebSocket**: `/home/z/my-project/realtime-service.log`
3. **سجلات قاعدة البيانات**: Firebase Console
4. **Firebase Console**: [https://console.firebase.google.com/project/civilprotectiondz](https://console.firebase.google.com/project/civilprotectiondz)

---

## 🔄 الإصلاحات السريعة

### إعادة تعيين المشروع الكامل

```bash
# 1. إيقاف جميع العمليات
pkill -f "node|bun"

# 2. حذف المجلدات المؤقتة
rm -rf /home/z/my-project/.next
rm -rf /home/z/my-project/node_modules/.cache

# 3. إعادة تثبيت الاعتماديات
bun install

# 4. التأكد من وجود .env.local
cat /home/z/my-project/.env.local

# 5. إعادة تشغيل
bun run dev
```

### استرجاع Firebase Configuration

إذا كانت هناك مشاكل في تكوين Firebase:

1. **إعادة إنشاء ملف .env.local**:
   ```bash
   # استخدم ملف .env.local من المستودع
   cp .env.example .env.local
   ```

2. **تحديث ملف firebase.json**:
   ```bash
   # تأكد من وجود ملف firebase.json
   cat /home/z/my-project/firebase.json
   ```

3. **إعادة تهيئة Firebase CLI**:
   ```bash
   firebase logout
   firebase login
   firebase use civilprotectiondz
   ```

---

## ✅ التحقق النهائي قبل الاستخدام

قبل استخدام المنصة مع Firebase الحقيقي، تأكد من:

- [ ] Firebase Authentication مُفعّل مع Email/Password provider
- [ ] Firestore Database مُنشأة ومُفعّلة
- [ ] Realtime Database مُنشأ ومُفعّل
- [ ] قواعد Firestore مُنشأة ومُنشورة
- [ ] قواعد Realtime Database مُنشأة ومُنشورة
- [ ] مستخدم واحد على الأقل مُنشأ في Firebase Auth
- [ ] مستخدم واحد على الأقل مُنشأ في Firestore Users Collection
- [ ] ملف .env.local موجود وبه التكوين الصحيح
- [ ] mلف firebase.json موجود ويتضمن التكوين الصحيح
- [ ] التطبيق يُبنى بنجاح (bun run build)
- [ ] لا توجد أخطاء TypeScript أو ESLint حرجة
- [ ] تسجيل الدخول يعمل مع مستخدم Firebase حقيقي
- [ ] يمكن قراءة البيانات من Firebase
- [ ] يمكن كتابة البيانات إلى Firebase (مع المستخدمين المناسبين)

---

## 🌐 تكامل Firebase الحقيقي

### المشروع

- **Project ID**: `civilprotectiondz`
- **Auth Domain**: `civilprotectiondz.firebaseapp.com`
- **Database URL**: `https://civilprotectiondz-default-rtdb.europe-west1.firebasedatabase.app`
- **Storage Bucket**: `civilprotectiondz.appspot.com`

### المستخدمون الاختباريين (لإنشائهم في Firebase Console)

```bash
# Administrator (مسؤول)
Email: admin@civilprotection.dz
Password: password123
Role: ADMINISTRATOR

# Commander (قائد)
Email: commander@civilprotection.dz
Password: password123
Role: COMMANDER

# Supervisor (مشرف)
Email: supervisor@civilprotection.dz
Password: password123
Role: SUPERVISOR

# Operator (مشغل)
Email: operator@civilprotection.dz
Password: password123
Role: OPERATOR
```

### خطوات التهيئة السريعة

1. **تفعيل Firebase Authentication**:
   - [Firebase Console](https://console.firebase.google.com/project/civilprotectiondz/authentication) → Sign-in method → Enable Email/Password

2. **إنشاء Firestore Database**:
   - [Firebase Console](https://console.firebase.google.com/project/civilprotectiondz/firestore) → Create database → europe-west1 → Start in Test Mode

3. **إنشاء Realtime Database**:
   - [Firebase Console](https://console.firebase.google.com/project/civilprotectiondz/database) → Create database → europe-west1 → Start in Test Mode

4. **إنشاء المستخدم الأول (Admin)**:
   - [Firebase Console](https://console.firebase.google.com/project/civilprotectiondz/authentication) → Users → Add user → admin@civilprotection.dz / password123

5. **إضافة المستخدم إلى Firestore**:
   - [Firebase Console](https://console.firebase.google.com/project/civilprotectiondz/firestore) → Start collection (users) → أضف المستند مع uid من Firebase Auth

---

## 📝 ملخص الخطوات الأساسية للإعداد

1. **تفعيل Firebase Auth** (للدخول)
2. **إنشاء Firestore Database** (للمستخدمين والحوادث)
3. **إنشاء Realtime Database** (للبيانات الحية)
4. **نشر قواعد الأمان** (firestore.rules, database.rules.json)
5. **إنشاء المستخدم الأول** (Admin)
6. **إضافة المستخدم إلى Firestore** (Users Collection)
7. **إعادة تشغيل التطبيق** (لتحميل التكوين الجديد)

---

**آخر تحديث**: يناير 2024
**الإصدار**: v1.1-firebase-ar
**مشروع Firebase**: civilprotectiondz
