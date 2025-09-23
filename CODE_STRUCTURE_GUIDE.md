# دليل هيكل الكود - The Assemblers Application

## نظرة عامة على التطبيق (Application Overview)

هذا تطبيق Angular 20 لخدمات التجميع، يربط بين العملاء والجمعين (Assemblers) لتجميع الأثاث والإلكترونيات والألعاب.

**التقنيات المستخدمة:**
- Angular 20 (Standalone Components)
- TypeScript
- SCSS
- RxJS
- Angular Router
- Angular Forms

---

## هيكل المشروع (Project Structure)

```
src/
├── app/
│   ├── core/                    # الملفات الأساسية
│   │   ├── guards/             # حماية الصفحات
│   │   ├── models/             # نماذج البيانات
│   │   └── services/           # الخدمات
│   ├── features/               # الميزات الرئيسية
│   │   ├── auth/              # المصادقة
│   │   ├── assembler/         # الجمعين
│   │   ├── customer/          # العملاء
│   │   ├── home/              # الصفحة الرئيسية
│   │   └── services/          # الخدمات
│   ├── shared/                # المكونات المشتركة
│   │   ├── components/        # مكونات قابلة لإعادة الاستخدام
│   │   └── layouts/           # تخطيطات الصفحات
│   ├── app.config.ts          # إعدادات التطبيق
│   ├── app.routes.ts          # مسارات التطبيق
│   └── app.ts                 # المكون الرئيسي
├── styles.scss                # الأنماط العامة
├── theme.scss                 # متغيرات الألوان والتصميم
└── main.ts                    # نقطة البداية
```

---

## نظام الألوان والتصميم (Color System & Design)

### الألوان الأساسية (Primary Colors)
```scss
$background-color: #121212;     // خلفية داكنة
$text-color: #ffffff;           // نص أبيض
$card-background: #ffffff;      // خلفية البطاقات
$card-text-color: #121212;      // نص البطاقات
$primary-color: #4a6baf;        // اللون الأساسي (أزرق)
$secondary-color: #6c757d;      // اللون الثانوي (رمادي)
$accent-color: #ffc107;         // لون التمييز (أصفر)
$error-color: #dc3545;          // لون الخطأ (أحمر)
$success-color: #28a745;        // لون النجاح (أخضر)
```

### نقاط التوقف للشاشات (Breakpoints)
```scss
@mixin mobile {
  @media (max-width: 768px) { @content; }
}

@mixin tablet {
  @media (min-width: 769px) and (max-width: 1024px) { @content; }
}

@mixin desktop {
  @media (min-width: 1025px) { @content; }
}
```

---

## نماذج البيانات (Data Models)

### 1. المستخدم (User)
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'assembler';
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. الجمع (Assembler)
```typescript
interface Assembler extends User {
  specialization: string;        // التخصص
  description: string;           // الوصف
  averageRating: number;         // التقييم المتوسط
  profileImage: string;          // صورة الملف الشخصي
  coverImage?: string;           // صورة الغلاف
  location: string;              // الموقع
  isVerified: boolean;           // هل هو موثق
}
```

### 3. الخدمة (Service)
```typescript
interface Service {
  id: string;
  name: string;                  // اسم الخدمة
  description: string;           // وصف الخدمة
  price: number;                 // السعر
  duration: number;              // المدة (بالدقائق)
  assemblerId: string;           // معرف الجمع
  categoryId: string;            // معرف الفئة
  isActive: boolean;             // هل الخدمة نشطة
}
```

### 4. الحجز (Booking)
```typescript
interface Booking {
  id: string;
  customerId: string;            // معرف العميل
  assemblerId: string;           // معرف الجمع
  serviceId: string;             // معرف الخدمة
  date: Date;                    // تاريخ الحجز
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;                // ملاحظات
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. الفئة (Category)
```typescript
interface Category {
  id: string;
  name: string;                  // اسم الفئة
  description: string;           // وصف الفئة
  image: string;                 // صورة الفئة
}
```

### 6. التقييم (Review)
```typescript
interface Review {
  id: string;
  customerId: string;            // معرف العميل
  assemblerId: string;           // معرف الجمع
  bookingId: string;             // معرف الحجز
  rating: number;                // التقييم (1-5)
  comment: string;               // التعليق
  createdAt: Date;
  updatedAt: Date;
}
```

---

## الخدمات (Services)

### 1. خدمة المصادقة (AuthService)
**الملف:** `src/app/core/services/auth.service.ts`
**الوظيفة:** إدارة تسجيل الدخول والخروج والمستخدم الحالي

**الطرق الرئيسية:**
- `login(email, password)` - تسجيل الدخول
- `register(userData)` - التسجيل
- `logout()` - تسجيل الخروج
- `getCurrentUser()` - الحصول على المستخدم الحالي
- `isAuthenticated()` - فحص حالة المصادقة

### 2. خدمة البيانات الوهمية (MockDataService)
**الملف:** `src/app/core/services/mock-data.service.ts`
**الوظيفة:** توفير بيانات وهمية للتطبيق

**الطرق الرئيسية:**
- `getUsers()` - الحصول على المستخدمين
- `getAssemblers()` - الحصول على الجمعين
- `getServices()` - الحصول على الخدمات
- `getBookings()` - الحصول على الحجوزات
- `getCategories()` - الحصول على الفئات
- `getReviews()` - الحصول على التقييمات

### 3. خدمة الخدمات (ServiceService)
**الملف:** `src/app/core/services/service.service.ts`
**الوظيفة:** إدارة الخدمات

### 4. خدمة الحجوزات (BookingService)
**الملف:** `src/app/core/services/booking.service.ts`
**الوظيفة:** إدارة الحجوزات

### 5. خدمة الفئات (CategoryService)
**الملف:** `src/app/core/services/category.service.ts`
**الوظيفة:** إدارة فئات الخدمات

---

## المسارات (Routes)

**الملف:** `src/app/app.routes.ts`

```typescript
const routes: Routes = [
  { path: '', component: LandingComponent },                    // الصفحة الرئيسية
  { path: 'login', component: LoginComponent },                 // تسجيل الدخول
  { path: 'register', component: RegisterComponent },           // التسجيل
  { 
    path: 'dashboard-customer', 
    component: DashboardCustomerComponent,
    canActivate: [AuthGuard]                                    // لوحة تحكم العميل (محمية)
  },
  { 
    path: 'dashboard-assembler', 
    component: DashboardAssemblerComponent,
    canActivate: [AuthGuard]                                    // لوحة تحكم الجمع (محمية)
  },
  { path: 'profile/:id', component: ProfileComponent },         // ملف الجمع الشخصي
  { path: 'services', component: ServicesComponent },           // صفحة الخدمات
  { path: '**', redirectTo: '' }                               // إعادة توجيه للصفحة الرئيسية
];
```

---

## المكونات الرئيسية (Main Components)

### 1. المكون الرئيسي (AppComponent)
**الملف:** `src/app/app.ts`
**الوظيفة:** المكون الجذر للتطبيق

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
})
export class AppComponent {
  title = 'The Assemblers';
}
```

### 2. الصفحة الرئيسية (LandingComponent)
**الملف:** `src/app/features/home/pages/landing/landing.component.ts`
**الوظيفة:** الصفحة الرئيسية للتطبيق

**المكونات المستخدمة:**
- `HeroComponent` - قسم البطل
- `CategoryListComponent` - قائمة الفئات
- `ServiceCardComponent` - بطاقات الخدمات

### 3. لوحة تحكم العميل (DashboardCustomerComponent)
**الملف:** `src/app/features/customer/pages/dashboard-customer/dashboard-customer.component.ts`
**الوظيفة:** لوحة تحكم العميل لعرض الحجوزات

### 4. لوحة تحكم الجمع (DashboardAssemblerComponent)
**الملف:** `src/app/features/assembler/pages/dashboard-assembler/dashboard-assembler.component.ts`
**الوظيفة:** لوحة تحكم الجمع لإدارة الحجوزات

---

## المكونات المشتركة (Shared Components)

### 1. الرأس (HeaderComponent)
**الملف:** `src/app/shared/components/header/header.component.ts`
**الوظيفة:** شريط التنقل العلوي

**الميزات:**
- عرض اسم المستخدم
- أزرار تسجيل الدخول/الخروج
- التنقل بين الصفحات

### 2. التذييل (FooterComponent)
**الملف:** `src/app/shared/components/footer/footer.component.ts`
**الوظيفة:** تذييل الصفحة

### 3. البطل (HeroComponent)
**الملف:** `src/app/shared/components/hero/hero.component.ts`
**الوظيفة:** قسم البطل في الصفحة الرئيسية

### 4. قائمة الفئات (CategoryListComponent)
**الملف:** `src/app/shared/components/category-list/category-list.component.ts`
**الوظيفة:** عرض فئات الخدمات

### 5. بطاقة الخدمة (ServiceCardComponent)
**الملف:** `src/app/shared/components/service-card/service-card.component.ts`
**الوظيفة:** عرض معلومات الخدمة

### 6. بطاقة الجمع (AssemblerCardComponent)
**الملف:** `src/app/shared/components/assembler-card/assembler-card.component.ts`
**الوظيفة:** عرض معلومات الجمع

### 7. نموذج الحجز (BookingFormComponent)
**الملف:** `src/app/shared/components/booking-form/booking-form.component.ts`
**الوظيفة:** نموذج إنشاء حجز جديد

### 8. شريط البحث (SearchBarComponent)
**الملف:** `src/app/shared/components/search-bar/search-bar.component.ts`
**الوظيفة:** شريط البحث في الخدمات

### 9. بطاقة التقييم (ReviewCardComponent)
**الملف:** `src/app/shared/components/review-card/review-card.component.ts`
**الوظيفة:** عرض تقييمات العملاء

---

## كيفية التعديل على التطبيق (How to Modify the Application)

### 1. إضافة صفحة جديدة (Adding a New Page)

**الخطوات:**
1. إنشاء مجلد جديد في `src/app/features/`
2. إنشاء المكون:
```bash
ng generate component features/new-feature/pages/new-page
```
3. إضافة المسار في `src/app/app.routes.ts`:
```typescript
{ path: 'new-page', component: NewPageComponent }
```

### 2. تعديل الألوان (Modifying Colors)

**الملف:** `src/theme.scss`
```scss
// تغيير اللون الأساسي
$primary-color: #your-color;

// تغيير لون الخلفية
$background-color: #your-color;
```

### 3. إضافة خدمة جديدة (Adding a New Service)

**الخطوات:**
1. إنشاء ملف في `src/app/core/services/`
2. إضافة الخدمة في `src/app/app.config.ts`:
```typescript
providers: [
  // ... existing providers
  NewService
]
```

### 4. تعديل نموذج البيانات (Modifying Data Models)

**الملف:** `src/app/core/models/`
```typescript
export interface YourModel {
  id: string;
  // إضافة خصائص جديدة
  newProperty: string;
}
```

### 5. إضافة مكون مشترك (Adding a Shared Component)

**الخطوات:**
1. إنشاء المكون في `src/app/shared/components/`
2. تصدير المكون من الملف
3. استيراد المكون في الصفحات التي تحتاجه

### 6. تعديل التخطيط (Modifying Layout)

**الملف:** `src/app/shared/layouts/dashboard-layout/`
- تعديل `dashboard-layout.component.html` للتخطيط
- تعديل `dashboard-layout.component.scss` للأنماط

---

## إعدادات التطبيق (Application Configuration)

### 1. إعدادات Angular
**الملف:** `src/app/app.config.ts`
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),           // المسارات
    provideClientHydration(),        // التحسين
    provideHttpClient(),             // HTTP
    provideAnimations(),             // الرسوم المتحركة
    // الخدمات
    CategoryService,
    MockDataService,
    AuthService,
    // ...
  ]
};
```

### 2. إعدادات TypeScript
**الملف:** `tsconfig.json`
- إعدادات TypeScript العامة

**الملف:** `tsconfig.app.json`
- إعدادات TypeScript للتطبيق

### 3. إعدادات Angular CLI
**الملف:** `angular.json`
- إعدادات البناء والتشغيل
- إعدادات SCSS
- إعدادات الأصول (Assets)

---

## الأوامر المفيدة (Useful Commands)

### تشغيل التطبيق
```bash
npm start
# أو
ng serve
```

### بناء التطبيق للإنتاج
```bash
npm run build
# أو
ng build
```

### بناء مع المراقبة
```bash
npm run watch
# أو
ng build --watch
```

### تشغيل الاختبارات
```bash
npm test
# أو
ng test
```

### إنشاء مكون جديد
```bash
ng generate component path/to/component
```

### إنشاء خدمة جديدة
```bash
ng generate service path/to/service
```

---

## نصائح للتطوير (Development Tips)

### 1. تنظيم الكود
- استخدم مجلدات منفصلة لكل ميزة
- ضع المكونات المشتركة في `shared/`
- استخدم أسماء واضحة للملفات والمكونات

### 2. إدارة الحالة
- استخدم الخدمات لإدارة البيانات
- استخدم RxJS للعمليات غير المتزامنة
- استخدم Guards لحماية الصفحات

### 3. التصميم المتجاوب
- استخدم Mixins للشاشات المختلفة
- اختبر على أحجام شاشات مختلفة
- استخدم CSS Grid و Flexbox

### 4. الأداء
- استخدم OnPush Change Detection
- استخدم Lazy Loading للمسارات
- استخدم TrackBy في *ngFor

---

## استكشاف الأخطاء (Troubleshooting)

### مشاكل شائعة:

1. **خطأ في الاستيراد:**
   - تأكد من المسار الصحيح
   - تأكد من تصدير المكون/الخدمة

2. **خطأ في التصميم:**
   - تأكد من استيراد theme.scss
   - تأكد من استخدام المتغيرات الصحيحة

3. **خطأ في المسارات:**
   - تأكد من إضافة المسار في app.routes.ts
   - تأكد من استيراد المكون

4. **خطأ في الخدمات:**
   - تأكد من إضافة الخدمة في app.config.ts
   - تأكد من استخدام @Injectable()

---

## الدعم والمساعدة (Support)

للمساعدة في التطوير:
1. راجع هذا الدليل أولاً
2. استخدم Angular CLI للمساعدة
3. راجع وثائق Angular الرسمية
4. استخدم TypeScript IntelliSense في VS Code

---

**آخر تحديث:** سبتمبر 2024
**الإصدار:** 1.0.0
