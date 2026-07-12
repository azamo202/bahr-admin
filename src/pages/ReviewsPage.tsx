import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, MessageCircle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config';

interface StatItem {
  valueAr: string;
  valueEn: string;
  labelAr: string;
  labelEn: string;
  labelKu: string;
}

interface ReviewItem {
  textAr: string;
  textEn: string;
  textKu: string;
}

export default function ReviewsPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState<{
    phone: string[];
    whatsapp: string;
    email: string;
    tiktok: string;
    facebook: string;
    instagram: string;
    youtube: string;
    stats: StatItem[];
    reviews: ReviewItem[];
  }>({
    phone: [''],
    whatsapp: '',
    email: '',
    tiktok: '',
    facebook: '',
    instagram: '',
    youtube: '',
    stats: [],
    reviews: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`${API_BASE_URL}/api/store-settings`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok && data.settings) {
          let phoneArray = [''];
          if (Array.isArray(data.settings.phone) && data.settings.phone.length > 0) {
            phoneArray = data.settings.phone;
          } else if (typeof data.settings.phone === 'string') {
             try {
                const parsed = JSON.parse(data.settings.phone);
                if (Array.isArray(parsed) && parsed.length > 0) phoneArray = parsed;
                else if (data.settings.phone) phoneArray = [data.settings.phone];
             } catch(e) {
                if (data.settings.phone) phoneArray = [data.settings.phone];
             }
          }

          setForm({
            phone: phoneArray,
            whatsapp: data.settings.whatsapp || '',
            email: data.settings.email || '',
            tiktok: data.settings.tiktok || '',
            facebook: data.settings.facebook || '',
            instagram: data.settings.instagram || '',
            youtube: data.settings.youtube || '',
            stats: Array.isArray(data.settings.stats) ? data.settings.stats : [],
            reviews: Array.isArray(data.settings.reviews) ? data.settings.reviews : [],
          });
        }
      } catch (error) {
        console.error("Fetch Settings Error:", error);
        toast.error(t('common.error', 'حدث خطأ في العملية'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [t]);

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE_URL}/api/store-settings`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        toast.success(t('settings.saved', 'تم حفظ الإعدادات بنجاح'));
      } else {
        const data = await res.json();
        toast.error(data.message || t('common.error', 'حدث خطأ في العملية'));
      }
    } catch (error) {
      console.error("Save Settings Error:", error);
      toast.error(t('common.error', 'حدث خطأ في العملية'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <PageHeader title={t('sidebar.reviews', 'آراء عملائنا')} />
        <div className="max-w-4xl mx-auto space-y-6 mt-6">
          <div className="h-64 bg-muted/20 border border-muted/40 rounded-2xl animate-pulse" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title={t('sidebar.reviews', 'آراء عملائنا')} 
        description={t('settings.customerReviewsDesc', 'تظهر هذه الآراء في الصفحة الرئيسية للموقع')}
        actions={
          <Button onClick={handleSave} disabled={isSubmitting || isLoading} className="h-9 gap-2 shadow-sm">
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('common.saving', 'جاري الحفظ...')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">{t('common.save', 'حفظ التغييرات')}</span>
              </>
            )}
          </Button>
        }
      />

      <div className="max-w-4xl mx-auto space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="border-b bg-muted/10 px-6 py-4 flex items-center gap-3">
            <div className="p-2.5 bg-green-500/10 text-green-600 rounded-xl">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{t('sidebar.reviews', 'آراء عملائنا')}</h2>
              <p className="text-sm text-muted-foreground">{t('settings.customerReviewsDesc', 'تظهر هذه الآراء في الصفحة الرئيسية للموقع')}</p>
            </div>
          </div>
          
          <div className="p-6 bg-white/50 space-y-6">
            {form.reviews.map((review, index) => (
              <div key={index} className="relative p-4 border rounded-xl bg-gray-50/50">
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon"
                  className="absolute -top-3 -end-3 h-8 w-8 rounded-full shadow-sm"
                  onClick={() => {
                    const newReviews = form.reviews.filter((_, i) => i !== index);
                    setForm({ ...form, reviews: newReviews });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{t('settings.reviewTextAr', 'الرأي (عربي)')}</Label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={review.textAr} 
                      onChange={(e) => {
                        const newReviews = [...form.reviews];
                        newReviews[index].textAr = e.target.value;
                        setForm({ ...form, reviews: newReviews });
                      }} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{t('settings.reviewTextEn', 'الرأي (انجليزي)')}</Label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={review.textEn} 
                      onChange={(e) => {
                        const newReviews = [...form.reviews];
                        newReviews[index].textEn = e.target.value;
                        setForm({ ...form, reviews: newReviews });
                      }} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{t('settings.reviewTextKu', 'الرأي (كردي)')}</Label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={review.textKu} 
                      onChange={(e) => {
                        const newReviews = [...form.reviews];
                        newReviews[index].textKu = e.target.value;
                        setForm({ ...form, reviews: newReviews });
                      }} 
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full border-dashed"
              onClick={() => setForm({ 
                ...form, 
                reviews: [...form.reviews, { textAr: '', textEn: '', textKu: '' }] 
              })}
            >
              <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('settings.addReview', 'إضافة رأي')}
            </Button>
          </div>
        </div>

        <div className="flex justify-end pt-4 pb-8">
          <Button onClick={handleSave} disabled={isSubmitting || isLoading} size="lg" className="w-full sm:w-auto min-w-[200px] h-12 text-base gap-2 shadow-md hover:shadow-lg transition-all">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('common.saving', 'جاري الحفظ...')}
              </span>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {t('common.save', 'حفظ التغييرات')}
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
