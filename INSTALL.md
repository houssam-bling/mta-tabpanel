# دليل التثبيت

## المتطلبات
- MTA: San Andreas (الإصدار 1.5 أو أحدث)
- سيرفر MTA

## خطوات التثبيت

### 1. نسخ الملفات
انسخ مجلد `mta-tabpanel` إلى مجلد `resources` في سيرفرك:
```
your-server/resources/mta-tabpanel/
```

### 2. تحديث meta.xml
أضف السطر التالي إلى ملف `mtaserver.conf`:
```xml
<resource src="mta-tabpanel" startup="true" protected="false" />
```

### 3. إعادة تشغيل السيرفر
```bash
restart
```

## الاستخدام

### فتح اللوحة
اضغط على زر **TAB** في لعبتك لفتح لوحة معلومات اللاعبين

### التنقل
- **↑** و **↓** للتنقل بين اللاعبين
- **ESC** لإغلاق اللوحة

## التخصيص

### تغيير الألوان
عدّل الألوان في `client/main.lua`:
```lua
local COLOR_HEADER = tocolor(30, 30, 50, 200)
local COLOR_ROW = tocolor(40, 40, 60, 180)
-- إلخ
```

### تغيير حجم اللوحة
```lua
local PANEL_WIDTH = 800
local PANEL_HEIGHT = 600
```

### تغيير مفتاح الفتح
ابحث عن `button == "tab"` وغيره إلى مفتاح آخر:
```lua
if button == "f2" and pressed then  -- مثال: F2
```

## المشاكل الشائعة

### اللوحة لا تظهر
- تأكد من تحميل المورد (resource)
- اضغط على TAB مرة أخرى

### الأسماء مقطوعة
- غيّر عرض الجدول في `PANEL_WIDTH`

### الأداء بطيء
- قلل عدد الصفوف المعروضة في `ROWS_PER_PAGE`

---

هل تحتاج مساعدة؟ اتصل بالدعم الفني
