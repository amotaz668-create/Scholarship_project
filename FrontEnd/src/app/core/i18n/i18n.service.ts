import { Injectable, signal } from '@angular/core';

export type Language = 'en' | 'ar';

/** Central UI dictionary. Keep user-facing copy here so Arabic mode never depends on browser translation. */
const translations: Record<string, string> = {
  'Explore':'استكشف',
  'My Journey':'رحلتي',
  'Saved':'المحفوظات',
  'Notifications':'الإشعارات',
  'Profile':'الملف الشخصي',
  'Sign out':'تسجيل الخروج',
  'Sign in':'تسجيل الدخول',
  'Start journey':'ابدأ الرحلة',
  'Overview':'نظرة عامة',
  'Scholarships':'المنح الدراسية',
  'Applications':'الطلبات',
  'Users':'المستخدمون',
  'Statistics':'الإحصائيات',
  'Admin logs':'سجلات الإدارة',
  'Application review':'مراجعة الطلبات',
  'Manage scholarships':'إدارة المنح الدراسية',
  'Manage applications':'إدارة الطلبات',
  'Manage users':'إدارة المستخدمين',
  'Search':'بحث',
  'Filters':'الفلاتر',
  'Reset':'إعادة تعيين',
  'Country':'الدولة',
  'University':'الجامعة',
  'Field':'المجال',
  'Funding':'التمويل',
  'Funding type':'نوع التمويل',
  'Degree':'الدرجة العلمية',
  'Deadline':'الموعد النهائي',
  'Deadline before':'الموعد النهائي قبل',
  'All destinations':'كل الوجهات',
  'All universities':'كل الجامعات',
  'All fields':'كل المجالات',
  'Any funding':'أي تمويل',
  'Any level':'أي مستوى',
  'Select':'اختر',
  'Male':'ذكر',
  'Female':'أنثى',
  'Status':'الحالة',
  'Draft':'مسودة',
  'Published':'منشورة',
  'Closed':'مغلقة',
  'All statuses':'كل الحالات',
  'Gender':'النوع',
  'Not specified':'غير محدد',
  'Scholarship':'منحة',
  'Scholarship Atlas':'أطلس المنح',
  'Edit':'تعديل',
  'Delete':'حذف',
  'View':'عرض',
  'Details':'التفاصيل',
  'Close':'إغلاق',
  'Create scholarship':'إنشاء منحة',
  'Save changes':'حفظ التغييرات',
  'Create scholarship →':'إنشاء المنحة →',
  'Saving…':'جارٍ الحفظ…',
  'Saving...':'جارٍ الحفظ…',
  'Title':'العنوان',
  'Description':'الوصف',
  'Provider':'الجهة المقدمة',
  'Category':'التصنيف',
  'Amount':'المبلغ',
  'Currency':'العملة',
  'Application URL':'رابط التقديم',
  'Eligibility':'الأهلية',
  'Minimum GPA':'الحد الأدنى للمعدل',
  'Maximum age':'الحد الأقصى للعمر',
  'Eligible degrees':'الدرجات المؤهلة',
  'Eligible fields':'المجالات المؤهلة',
  'Required documents':'المستندات المطلوبة',
  'Search title or provider':'ابحث بالعنوان أو الجهة المقدمة',
  'No scholarships found':'لم يتم العثور على منح',
  'Create the first scholarship or change your filters.':'أنشئ أول منحة أو غيّر الفلاتر.',
  'Could not load the Atlas':'تعذر تحميل الأطلس',
  'Explore opportunity':'استكشف الفرصة',
  'Explore opportunity without borders.':'استكشف الفرص بلا حدود.',
  'Search the live scholarship catalog, pick a destination, and open the route to your next degree.':'ابحث في دليل المنح الحالي، واختر وجهة، وافتح طريقك إلى درجتك العلمية القادمة.',
  'Plot this route →':'اعرض هذا المسار →',
  'Route planner':'مخطط المسار',
  'Live opportunity network':'شبكة الفرص المباشرة',
  'routes found':'مسارات موجودة',
  'Available boarding passes':'بطاقات السفر المتاحة',
  'opportunities':'فرص',
  'Data from the live backend catalog':'البيانات من دليل المنح المباشر',
  'Try changing your filters or explore another destination.':'جرّب تغيير الفلاتر أو استكشف وجهة أخرى.',
  'About this opportunity':'عن هذه الفرصة',
  'Who can apply':'من يمكنه التقديم',
  'Your funding package':'حزمة التمويل الخاصة بك',
  'Pack your application':'جهّز طلبك',
  'Before departure':'قبل السفر',
  'Ready to begin?':'هل أنت مستعد للبدء؟',
  'Start application →':'ابدأ الطلب →',
  'Save scholarship':'حفظ المنحة',
  'Saved ✓':'تم الحفظ ✓',
  'Visit provider website ↗':'زيارة موقع الجهة ↗',
  'Required':'مطلوب',
  'Optional':'اختياري',
  'Open':'مفتوح',
  'Sign in to apply →':'سجّل الدخول للتقديم →',
  'Login':'تسجيل الدخول',
  'Registration':'التسجيل',
  'Full name':'الاسم الكامل',
  'Email address':'البريد الإلكتروني',
  'Password':'كلمة المرور',
  'Already registered?':'مسجل بالفعل؟',
  'New to the Atlas?':'جديد على الأطلس؟',
  'Your journey starts here':'رحلتك تبدأ من هنا',
  'Create your student account and start building a reusable scholarship profile.':'أنشئ حساب الطالب وابدأ في بناء ملف منح قابل لإعادة الاستخدام.',
  'Dashboard':'لوحة التحكم',
  'Personal information':'المعلومات الشخصية',
  'Academic record':'السجل الأكاديمي',
  'Destination preferences':'تفضيلات الوجهة',
  'Date of birth':'تاريخ الميلاد',
  'Phone':'الهاتف',
  'Nationality':'الجنسية',
  'Address':'العنوان',
  'Faculty':'الكلية',
  'Department':'القسم',
  'Graduation year':'سنة التخرج',
  'GPA (0–4)':'المعدل (0–4)',
  'Target degree':'الدرجة المستهدفة',
  'English level':'مستوى الإنجليزية',
  'Preferred majors':'التخصصات المفضلة',
  'Preferred countries':'الدول المفضلة',
  'Skills':'المهارات',
  'Languages':'اللغات',
  'Interests':'الاهتمامات',
  'Bio':'نبذة',
  'Save profile →':'حفظ الملف →',
  'Save account':'حفظ الحساب',
  'Saving passport…':'جارٍ حفظ الملف…',
  'Upload':'رفع',
  'Uploading…':'جارٍ الرفع…',
  'Document type':'نوع المستند',
  'No documents uploaded yet.':'لم يتم رفع مستندات بعد.',
  'Travel-ready files':'ملفات جاهزة للسفر',
  'View details →':'عرض التفاصيل →',
  'No actions':'لا توجد إجراءات',
  'Actions':'الإجراءات',
  'Destination':'الوجهة',
  'Scholarship ID':'معرّف المنحة',
  'English':'English',
  'العربية':'العربية',
  'Light':'فاتح',
  'Dark':'داكن',
  'Theme':'المظهر',
  'Language':'اللغة',
  'Toggle navigation':'تبديل التنقل',
  'Language and theme controls':'إعدادات اللغة والمظهر',
  'OPPORTUNITY CATALOG':'دليل الفرص',
  'OPPORTUNITY PASSPORT':'جواز الفرص',
  'SCHOLARSHIP ATLAS':'أطلس المنح',
  'LIVE OPPORTUNITY NETWORK':'شبكة الفرص المباشرة',
  'AVAILABLE BOARDING PASSES':'بطاقات السفر المتاحة',
  'ROUTE PLANNER':'مخطط المسار',
  'PERSONAL INFORMATION':'المعلومات الشخصية',
  'ACADEMIC RECORD':'السجل الأكاديمي',
  'DESTINATION PREFERENCES':'تفضيلات الوجهة',
  'DOCUMENT WALLET':'محفظة المستندات',
  'YOUR NEXT MOVE':'خطوتك التالية',
  'YOUR JOURNEY STARTS HERE':'رحلتك تبدأ من هنا',
  'WELCOME BACK, TRAVELER':'مرحباً بعودتك، أيها المسافر',
  'CREATE ACCOUNT':'إنشاء حساب',
  'SIGN IN':'تسجيل الدخول',
  'STATUS':'الحالة',
  'DAYS LEFT':'الأيام المتبقية',
  'DEADLINE BOARD':'لوحة المواعيد النهائية',
  'APPLICATION INFORMATION':'معلومات التقديم',
  'BENEFITS & FUNDING':'المزايا والتمويل',
  'REQUIRED DOCUMENTS':'المستندات المطلوبة',
  'APPLICATION JOURNEY':'رحلة التقديم',
  'APPLICATION JOURNEYS':'رحلات التقديم',
  'MY APPLICATIONS':'طلباتي',
  'SAVED OPPORTUNITIES':'الفرص المحفوظة',
  'RECENT ACTIVITY':'النشاط الأخير',
  'RECENT CATALOG':'الدليل الأخير',
  'RECENT PROGRESS':'التقدم الأخير',
  'RECOMMENDED OPPORTUNITIES':'الفرص الموصى بها',
  'SYSTEM OVERVIEW':'نظرة عامة على النظام',
  'USER DIRECTORY':'دليل المستخدمين',
  'AUDIT TRAIL':'سجل التدقيق',
  'DECISION DESK':'مكتب القرارات',
  'APPLICATION REVIEW':'مراجعة الطلبات',
  'APPLICATION OPERATIONS':'عمليات الطلبات',
  'EMPLOYEE WORKLOAD':'عبء عمل الموظفين',
  'ADMIN CONTROL':'تحكم المسؤول',
  'EMPLOYEE DESK':'مكتب الموظف',
  'SYSTEM INTELLIGENCE':'ذكاء النظام',
  'POPULAR DESTINATIONS':'الوجهات الشائعة',
  'FRESH ROUTES TO EXPLORE':'مسارات جديدة للاستكشاف',
  'Full statistics →':'الإحصائيات الكاملة →',
  'Explore opportunities →':'استكشف الفرص →',
  'Manage catalog →':'إدارة الدليل →',
  'No published scholarships found.':'لم يتم العثور على منح منشورة.',
  'Mark all as read':'تحديد الكل كمقروء',
  'Mark read':'تحديد كمقروء',
  'Withdraw':'سحب الطلب',
  'Submit application':'إرسال الطلب',
  'Submitted':'مُرسل',
  'Started':'بدأ',
  'Created':'تم الإنشاء',
  'Joined':'انضم',
  'No documents attached to this application.':'لا توجد مستندات مرفقة بهذا الطلب.',
  'No custom answers supplied.':'لم تتم إضافة إجابات مخصصة.',
  'No further status transitions are allowed.':'لا توجد انتقالات حالة أخرى متاحة.',
  'The provider has not listed required documents yet.':'لم تحدد الجهة المقدمة المستندات المطلوبة بعد.',
  'Exact amount is not specified by the provider.':'لم تحدد الجهة المقدمة المبلغ بدقة.',
  'Draft created. Opening My Applications…':'تم إنشاء المسودة. جارٍ فتح طلباتي…',
  'Could not create the application.':'تعذر إنشاء الطلب.',
  'This scholarship could not be found.':'تعذر العثور على هذه المنحة.',
  'Unable to create your account.':'تعذر إنشاء حسابك.',
  'Account details updated.':'تم تحديث بيانات الحساب.',
  'Opportunity Passport updated.':'تم تحديث جواز الفرص.',
  'Could not update saved scholarships.':'تعذر تحديث المنح المحفوظة.',
  'View all →':'عرض الكل →',
  'Open Atlas →':'فتح الأطلس →',
  'Open the Atlas →':'فتح الأطلس →',
  'Your next opportunity is waiting.':'فرصتك القادمة بانتظارك.',
  'Return to your Opportunity Passport and continue the journey.':'عد إلى جواز الفرص الخاص بك وتابع رحلتك.',
  'Open your passport':'افتح جواز الفرص الخاص بك',
  'Use the account created by the Scholarship Atlas team.':'استخدم الحساب الذي أنشأه فريق أطلس المنح.',
  'Opening passport…':'جارٍ فتح جواز الفرص…',
  'Sign in →':'تسجيل الدخول →',
  'Start your journey':'ابدأ رحلتك',
  'One profile. A world of opportunity.':'ملف واحد. عالم من الفرص.',
  'Get your passport':'احصل على جواز الفرص الخاص بك',
  'Registration creates a Student account. Staff roles are created by an Admin.':'التسجيل ينشئ حساب طالب. يتم إنشاء حسابات الموظفين بواسطة المسؤول.',
  'Your full name':'اسمك الكامل',
  'Minimum 6 characters':'6 أحرف على الأقل',
  'At least 6 characters':'6 أحرف على الأقل',
  'Create student account →':'إنشاء حساب الطالب →',
  'Creating passport…':'جارٍ إنشاء جواز الفرص…',
  'GLOBAL OPPORTUNITIES, ONE PASSPORT':'فرص عالمية، جواز واحد',
  'YOUR FUTURE':'مستقبلك',
  'HAS NO BORDERS.':'بلا حدود.',
  'Discover scholarships around the world and turn opportunities into your next destination.':'اكتشف المنح حول العالم وحوّل الفرص إلى وجهتك القادمة.',
  'Search scholarship, country, university or field':'ابحث عن منحة أو دولة أو جامعة أو مجال',
  'Explore · Discover · Qualify · Apply · Study':'استكشف · اكتشف · تأهل · قدّم · ادرس',
  'Successful applications':'طلبات ناجحة',
  'Protected statistic':'إحصائية محمية',
  'Countries':'الدول',
  'Universities':'الجامعات',
  'Pick a place on your horizon.':'اختر وجهة على أفقك.',
  'Your next boarding pass.':'بطاقة سفرك القادمة.',
  'Create your passport →':'أنشئ جواز الفرص →',
  'scholarship':'منحة',
  'scholarships':'منح',
  'available':'متاحة',
  'No destinations yet':'لا توجد وجهات بعد',
  'Atlas unavailable':'الأطلس غير متاح',
  'Scholarship unavailable':'المنحة غير متاحة',
  'Start the backend and refresh the Atlas.':'شغّل الخادم ثم حدّث الأطلس.',
  'Search scholarship or application ID':'ابحث عن منحة أو معرّف طلب',
  'Where you want to go':'إلى أين تريد الذهاب؟',
  'Scholarship, provider…':'المنحة أو الجهة المقدمة…',
  'No results':'لا توجد نتائج',
  'Loading…':'جارٍ التحميل…',
  'Loading...':'جارٍ التحميل…',
  'Review workspace':'مساحة مراجعة الطلبات',
  'Manage the scholarship catalog and review an application when you have its ID.':'أدر دليل المنح وراجع أي طلب عند توفر معرّفه.',
  'Review by ID →':'مراجعة بالمعرّف →',
  'Catalog records':'سجلات الدليل',
  'Loaded from API':'محمّل من واجهة API',
  'Assigned applications':'الطلبات المعيّنة',
  'Under review':'قيد المراجعة',
  'Completed reviews':'المراجعات المكتملة',
  'Listing API not exposed':'واجهة عرض القائمة غير متاحة',
  'BACKEND CAPABILITY NOTE':'ملاحظة حول قدرات الخادم',
  'Assigned queue is not exposed yet':'قائمة الطلبات المعيّنة غير متاحة بعد',
  'Open review lookup':'فتح البحث عن طلب',
  'Recent catalog':'الدليل الأخير',
  'No catalog records':'لا توجد سجلات في الدليل',
  'Create scholarships from the catalog page.':'أنشئ المنح من صفحة الدليل.',
  'Review by application ID':'مراجعة باستخدام معرّف الطلب',
  'The current backend supports employee lookup and status updates by ID, but not an assigned-applications list.':'الخادم الحالي يدعم البحث عن الطلبات وتحديث حالتها بالمعرّف، لكنه لا يوفر قائمة بالطلبات المعيّنة.',
  '24-character MongoDB application ID':'معرّف طلب MongoDB مكوّن من 24 حرفاً',
  'Looking up…':'جارٍ البحث…',
  'Find application →':'البحث عن الطلب →',
  'APPLICATION CONTENT':'محتوى الطلب',
  'Submitted information':'المعلومات المرسلة',
  'Student ID':'معرّف الطالب',
  'Application ID':'معرّف الطلب',
  'Not submitted':'لم يتم الإرسال',
  'Answers':'الإجابات',
  'Documents attached to application':'المستندات المرفقة بالطلب',
  'Move journey forward':'انقل الطلب إلى الخطوة التالية',
  'Review note':'ملاحظة المراجعة',
  'Explain the next step to the student':'اشرح الخطوة التالية للطالب',
  'Enter an application ID':'أدخل معرّف طلب',
  'Open one application securely using the existing GET /applications/:id route.':'افتح طلباً بأمان باستخدام المسار الحالي GET /applications/:id.',
  'ADMIN ACTION':'إجراء إداري',
  'Create staff account':'إنشاء حساب موظف',
  'Public registration always creates students. Staff accounts use the protected endpoint.':'التسجيل العام ينشئ حسابات طلاب فقط. حسابات الموظفين تستخدم المسار المحمي.',
  'Name':'الاسم',
  'New password':'كلمة مرور جديدة',
  'Temporary password':'كلمة المرور المؤقتة',
  'Role':'الدور',
  'Employee':'موظف',
  'Admin':'مسؤول',
  'Student':'طالب',
  'Create account':'إنشاء الحساب',
  'Total users':'إجمالي المستخدمين',
  'All roles':'جميع الأدوار',
  'Total journeys':'إجمالي الرحلات',
  'Pending':'قيد الانتظار',
  'Accepted':'مقبول',
  'Successful':'ناجحة',
  'Rejected':'مرفوض',
  'Closed decisions':'قرارات مغلقة',
  'System overview':'نظرة عامة على النظام',
  'Live totals from the admin dashboard and statistics APIs.':'الإجماليات المباشرة من لوحة الإدارة وواجهات الإحصائيات.',
  'APPLICATION MIX':'توزيع الطلبات',
  'By status':'حسب الحالة',
  'No application data':'لا توجد بيانات طلبات',
  'Aggregates will appear after applications are created.':'ستظهر الإحصائيات بعد إنشاء الطلبات.',
  'Admin log':'سجل الإدارة',
  'All logs →':'كل السجلات →',
  'No activity yet':'لا يوجد نشاط بعد',
  'Logged admin actions will appear here.':'ستظهر إجراءات الإدارة المسجلة هنا.',
  'No users found':'لم يتم العثور على مستخدمين',
  'No logs yet':'لا توجد سجلات بعد',
  'No aggregate data':'لا توجد بيانات مجمعة',
  'MongoDB aggregations returned by the existing admin statistics endpoint.':'إحصائيات MongoDB المجمعة التي يعيدها مسار إحصائيات الإدارة الحالي.',
  'Search name or email':'ابحث بالاسم أو البريد الإلكتروني',
  'Try changing the directory filters.':'جرّب تغيير فلاتر الدليل.',
  'Only safe account fields are shown. Passwords and hashes are never returned or displayed.':'يتم عرض حقول الحساب الآمنة فقط. لا يتم إرجاع كلمات المرور أو التجزئات أو عرضها.',
  'Applications by status':'الطلبات حسب الحالة',
  'No assigned applications':'لا توجد طلبات معيّنة',
  'The backend currently has no route to assign applications, so this aggregate may remain empty.':'الخادم لا يحتوي حالياً على مسار لتعيين الطلبات، لذلك قد تبقى هذه الإحصائية فارغة.',
  'This chart will populate when matching records exist.':'سيتم ملء هذا الرسم عند وجود سجلات مطابقة.',
  'Recorded approval, rejection, deletion and deactivation events.':'أحداث الموافقة والرفض والحذف وإلغاء التفعيل المسجلة.',
  'MY OPPORTUNITY PASSPORT':'جواز الفرص الخاص بي',
  'Every stamp tells':'كل ختم يحكي',
  'your story.':'قصتك.',
  'Follow your applications from discovery to destination.':'تابع طلباتك من الاكتشاف حتى الوصول إلى الوجهة.',
  'STUDENT JOURNEY':'رحلة الطالب',
  'Your routes in motion':'مساراتك قيد التنفيذ',
  'Discover another route':'اكتشف مساراً آخر',
  'No passport stamps yet':'لا توجد أختام في الجواز بعد',
  'Routes currently':'المسارات حالياً',
  'in motion.':'قيد التنفيذ.',
  'Review drafts, submit applications and track every status change.':'راجع المسودات وأرسل الطلبات وتابع كل تغيير في الحالة.',
  'Withdraw this application? This cannot be reversed.':'هل تريد سحب هذا الطلب؟ لا يمكن التراجع عن ذلك.',
  'No applications found':'لم يتم العثور على طلبات',
  'Start an application and your journey will appear here.':'ابدأ طلباً وستظهر رحلتك هنا.',
  'Start an application inside Scholarship Atlas. It will be created as a draft so you can review it before submission.':'ابدأ طلباً داخل أطلس المنح. سيتم إنشاؤه كمسودة لتراجعه قبل الإرسال.',
  'Nothing saved yet':'لا توجد منح محفوظة بعد',
  'Save scholarships from Explore to build your shortlist.':'احفظ المنح من صفحة الاستكشاف لبناء قائمتك المختصرة.',
  'JOURNEY UPDATES':'تحديثات الرحلة',
  'Status updates and important changes from the backend.':'تحديثات الحالة والتغييرات المهمة من الخادم.',
  'You’re all caught up':'أنت على اطلاع بكل شيء',
  'You\'re all caught up':'أنت على اطلاع بكل شيء',
  'New application updates will appear here.':'ستظهر تحديثات الطلبات الجديدة هنا.',
  'TRAVELER PROFILE':'ملف المسافر',
  'Passport holder':'صاحب جواز الفرص',
  'PDF/JPG/PNG · max set by backend':'PDF/JPG/PNG · الحد الأقصى يحدده الخادم',
  'DOC':'مستند',
  'Profile completion':'اكتمال الملف',
  'Match score':'درجة المطابقة',
  'No scoring API available':'لا توجد واجهة لحساب المطابقة',
  'Active applications':'الطلبات النشطة',
  'On the way':'في الطريق',
  'Upcoming deadlines':'المواعيد النهائية القادمة',
  'Next 30 days':'الثلاثون يوماً القادمة',
  'Unread notifications':'الإشعارات غير المقروءة',
  'Journey updates':'تحديثات الرحلة',
  'Saved scholarships':'المنح المحفوظة',
  'From your profile':'من ملفك',
  'JOURNEY COMMAND CENTER':'مركز قيادة الرحلة',
  'Ready to discover your next opportunity?':'هل أنت مستعد لاكتشاف فرصتك القادمة؟',
  'Explore the Atlas →':'استكشف الأطلس →',
  'OPPORTUNITY PROFILE':'ملف الفرص',
  'Your passport strength':'قوة جواز الفرص الخاص بك',
  'A complete profile helps you evaluate eligibility faster.':'يساعدك الملف المكتمل على تقييم الأهلية بشكل أسرع.',
  'Complete profile →':'أكمل الملف →',
  'Your active route':'مسارك النشط',
  'All applications →':'كل الطلبات →',
  'Next departures':'المواعيد القادمة',
  'Published scholarships will appear here when the backend has data.':'ستظهر المنح المنشورة هنا عند توفر بيانات من الخادم.',
  'RECOMMENDED':'موصى به',
  'Fresh routes to explore':'مسارات جديدة للاستكشاف',
  'Back to Atlas':'العودة إلى الأطلس',
  'ABOUT THIS OPPORTUNITY':'عن هذه الفرصة',
  'Your coordinates':'إحداثياتك',
  'Your current position':'موقعك الحالي',
  'Open level':'المستوى المفتوح',
  'Multiple institutions':'عدة مؤسسات',
  'Application information':'معلومات التقديم',
  'Benefits & Funding':'المزايا والتمويل',
  'comma separated':'مفصولة بفواصل',
  'comma separated; saved as required':'مفصولة بفواصل؛ تُحفظ كما هي',
  'Bachelor':'بكالوريوس',
  'Master':'ماجستير',
  'PhD':'دكتوراه',
  'Something went wrong. Please try again.':'حدث خطأ ما. حاول مرة أخرى.',
  'We could not reach the scholarship service. Start the backend and try again.':'تعذر الوصول إلى خدمة المنح. شغّل الخادم وحاول مرة أخرى.',
  'Your session expired. Sign in again to continue.':'انتهت جلستك. سجّل الدخول مرة أخرى للمتابعة.',
  'Unable to sign in.':'تعذر تسجيل الدخول.',
  '01 / OVERVIEW':'01 / نظرة عامة',
  '02 / ELIGIBILITY':'02 / الأهلية',
  '03 / BENEFITS & FUNDING':'03 / المزايا والتمويل',
  '04 / REQUIRED DOCUMENTS':'04 / المستندات المطلوبة',
  '05 / APPLICATION INFORMATION':'05 / معلومات التقديم',
  'Add scholarship →':'إضافة منحة →',
  'Admin-only application list with transitions enforced by the backend.':'قائمة طلبات خاصة بالمسؤول مع فرض انتقالات الحالة بواسطة الخادم.',
  'Apply filters':'تطبيق الفلاتر',
  'Application':'طلب',
  'Build your Opportunity':'ابنِ جواز فرصك',
  'Build your profile once, follow every application, and keep your entire journey in one place.':'أنشئ ملفك مرة واحدة، وتابع كل طلب، واحتفظ برحلتك كاملة في مكان واحد.',
  'Close scholarship details':'إغلاق تفاصيل المنحة',
  'Close scholarship editor':'إغلاق محرر المنحة',
  'Complete academic and personal details to strengthen your passport.':'أكمل بياناتك الأكاديمية والشخصية لتعزيز جواز الفرص.',
  'Create and maintain records using the backend scholarship schema.':'أنشئ السجلات وأدرها باستخدام مخطط المنح في الخادم.',
  'CV, Transcript, Passport':'السيرة الذاتية، كشف الدرجات، جواز السفر',
  'Date':'التاريخ',
  'Degrees':'الدرجات العلمية',
  'Email':'البريد الإلكتروني',
  'Every application is a step toward somewhere new.':'كل طلب هو خطوة نحو وجهة جديدة.',
  'Explore →':'استكشف →',
  'FIELD':'المجال',
  'FUNDING':'التمويل',
  'Fully Funded':'تمويل كامل',
  'Next action':'الإجراء التالي',
  'No applications in this stage':'لا توجد طلبات في هذه المرحلة',
  'Passport.':'جواز الفرص.',
  'Published scholarships from the backend will appear here.':'ستظهر المنح المنشورة من الخادم هنا.',
  'These are the exact profile fields supported by the student profile API.':'هذه هي حقول الملف الشخصي التي تدعمها واجهة ملف الطالب بالضبط.',
  'USD':'دولار أمريكي',
  'Your personal':'الخاص بك',
  'departure board.':'لوحة المغادرة.',
  'without borders.':'بلا حدود.',
  'Menu':'القائمة',
  'Account':'الحساب',
  'Passport':'جواز الفرص',
  'published':'منشورة','draft':'مسودة','closed':'مغلقة','accepted':'مقبول','approved':'تمت الموافقة','rejected':'مرفوض','withdrawn':'مسحوب','active':'نشط','under review':'قيد المراجعة','under_review':'قيد المراجعة','submitted':'تم الإرسال','pending':'قيد الانتظار','missing documents':'مستندات ناقصة','missing_documents':'مستندات ناقصة',
  'user_created':'تم إنشاء المستخدم','user_updated':'تم تحديث المستخدم','user_deleted':'تم حذف المستخدم','scholarship_created':'تم إنشاء المنحة','scholarship_updated':'تم تحديث المنحة','scholarship_deleted':'تم حذف المنحة','application_created':'تم إنشاء الطلب','application_updated':'تم تحديث الطلب','application_submitted':'تم إرسال الطلب',
  'employee':'موظف','admin':'مسؤول','student':'طالب','inactive':'غير نشط',
  'Germany':'ألمانيا',
  'Russia':'روسيا',
  'Turkey':'تركيا',
  'Türkiye':'تركيا',
  'Canada':'كندا',
  'Romania':'رومانيا',
  'Saudi Arabia':'المملكة العربية السعودية',
  'Egypt':'مصر',
  'United States':'الولايات المتحدة',
  'United Kingdom':'المملكة المتحدة',
  'France':'فرنسا',
  'United Arab Emirates':'الإمارات العربية المتحدة',
  'South Korea':'كوريا الجنوبية',
  'North Korea':'كوريا الشمالية',
  'Vatican City':'مدينة الفاتيكان',
  'Brunei Darussalam':'بروناي دار السلام',
  'Côte d’Ivoire':'ساحل العاج',
  'Czech Republic':'التشيك',
  'Republic of Korea':'جمهورية كوريا',
  'Russian Federation':'الاتحاد الروسي',
  'Great Britain':'بريطانيا العظمى',
  'Korea Republic of':'جمهورية كوريا',
  'Democratic People’s Republic of Korea':'جمهورية كوريا الشعبية الديمقراطية',
};

const phraseKeys = Object.keys(translations).sort((a, b) => b.length - a.length);

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly language = signal<Language>(this.readLanguage());
  private readonly originalText = new WeakMap<Text, string>();
  private readonly originalAttributes = new WeakMap<HTMLElement, Record<string, string | null>>();
  private observer?: MutationObserver;
  private translating = false;

  constructor() {
    this.applyDocumentState();
    queueMicrotask(() => this.translateDocument());
    this.observeDom();
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    localStorage.setItem('scholarship-atlas-language', language);
    this.applyDocumentState();
    this.translateDocument();
  }

  toggleLanguage(): void { this.setLanguage(this.language() === 'en' ? 'ar' : 'en'); }

  translate(value: string): string {
    if (this.language() === 'en') return value;
    const normalized = value.replace(/\s+/g, ' ').trim();
    if (!normalized) return value;
    const exact = translations[normalized];
    if (exact) return this.preserveWhitespace(value, exact);

    let result = value;
    for (const key of phraseKeys) {
      if (!key || key.length < 3) continue;
      if (result.includes(key)) result = result.split(key).join(translations[key]);
    }
    return result;
  }

  private readLanguage(): Language {
    return localStorage.getItem('scholarship-atlas-language') === 'ar' ? 'ar' : 'en';
  }

  private applyDocumentState(): void {
    const doc = document.documentElement;
    doc.lang = this.language();
    doc.dir = this.language() === 'ar' ? 'rtl' : 'ltr';
    doc.dataset['language'] = this.language();
  }

  private observeDom(): void {
    this.observer = new MutationObserver((mutations) => {
      if (this.translating) return;
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') this.translateTextNode(mutation.target as Text);
        else mutation.addedNodes.forEach((node) => this.translateNode(node));
      }
    });
    this.observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  private translateDocument(): void {
    if (this.translating) return;
    this.translating = true;
    try {
      this.translateNode(document.body);
      document.querySelectorAll<HTMLElement>('input[placeholder], textarea[placeholder], [title], [aria-label]').forEach((element) => this.translateAttributes(element));
    } finally {
      this.translating = false;
    }
  }

  private translateNode(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      this.translateTextNode(node as Text);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const element = node as HTMLElement;
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName)) return;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const texts: Text[] = [];
    let text: Node | null;
    while ((text = walker.nextNode())) texts.push(text as Text);
    texts.forEach((item) => this.translateTextNode(item));
    if (element.matches('input[placeholder], textarea[placeholder], [title], [aria-label]')) this.translateAttributes(element);
    element.querySelectorAll<HTMLElement>('input[placeholder], textarea[placeholder], [title], [aria-label]').forEach((item) => this.translateAttributes(item));
  }

  private translateTextNode(textNode: Text): void {
    const parent = textNode.parentElement;
    if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) return;

    const current = textNode.textContent ?? '';
    const stored = this.originalText.get(textNode);
    let original = stored;
    const storedRendered = stored ? this.renderTranslation(stored) : undefined;

    // Angular can update an existing text node when an API value changes. Detect that
    // and refresh the English source instead of translating an obsolete value.
    if (!stored || (this.language() === 'ar' && current !== storedRendered && current.trim() !== this.renderTranslation(current).trim())) {
      original = current;
      this.originalText.set(textNode, original);
    }
    if (!original) return;

    const next = this.renderTranslation(original);
    if (current !== next) textNode.textContent = next;
  }

  private renderTranslation(original: string): string {
    if (this.language() === 'en') return original;
    const leading = original.match(/^\s*/)?.[0] ?? '';
    const trailing = original.match(/\s*$/)?.[0] ?? '';
    return leading + this.translate(original.trim()) + trailing;
  }

  private translateAttributes(element: HTMLElement): void {
    if (!this.originalAttributes.has(element)) {
      const values: Record<string, string | null> = {};
      for (const attr of ['placeholder', 'title', 'aria-label']) values[attr] = element.getAttribute(attr);
      this.originalAttributes.set(element, values);
    }
    const originals = this.originalAttributes.get(element)!;
    for (const attr of ['placeholder', 'title', 'aria-label']) {
      const value = originals[attr];
      if (value == null) continue;
      const next = this.language() === 'ar' ? this.translate(value) : value;
      if (element.getAttribute(attr) !== next) element.setAttribute(attr, next);
    }
  }

  private preserveWhitespace(source: string, translated: string): string {
    const leading = source.match(/^\s*/)?.[0] ?? '';
    const trailing = source.match(/\s*$/)?.[0] ?? '';
    return leading + translated + trailing;
  }
}
