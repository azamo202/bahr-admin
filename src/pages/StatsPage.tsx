import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, BarChart, Plus, Trash2 } from 'lucide-react';
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

export default function StatsPage() {
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
        <PageHeader title={t('sidebar.stats', 'إحصائيات الشركة')} />
        <div className="max-w-4xl mx-auto space-y-6 mt-6">
          <div className="h-64 bg-muted/20 border border-muted/40 rounded-2xl animate-pulse" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title={t('sidebar.stats', 'إحصائيات الشركة')} 
        description={t('settings.companyStatsDesc', 'تظهر هذه الإحصائيات في الصفحة الرئيسية وصفحة من نحن')}
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
            <div className="p-2.5 bg-purple-500/10 text-purple-600 rounded-xl">
              <BarChart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{t('sidebar.stats', 'إحصائيات الشركة')}</h2>
              <p className="text-sm text-muted-foreground">{t('settings.companyStatsDesc', 'تظهر هذه الإحصائيات في الصفحة الرئيسية وصفحة من نحن')}</p>
            </div>
          </div>
          
          <div className="p-6 bg-white/50 space-y-6">
            {form.stats.map((stat, index) => (
              <div key={index} className="relative p-4 border rounded-xl bg-gray-50/50">
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon"
                  className="absolute -top-3 -end-3 h-8 w-8 rounded-full shadow-sm"
                  onClick={() => {
                    const newStats = form.stats.filter((_, i) => i !== index);
                    setForm({ ...form, stats: newStats });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{t('settings.statValueAr', 'القيمة (عربي) - مثلا 15+')}</Label>
                    <Input 
                      className="h-9 bg-white" 
                      value={stat.valueAr} 
                      onChange={(e) => {
                        const newStats = [...form.stats];
                        newStats[index].valueAr = e.target.value;
                        setForm({ ...form, stats: newStats });
                      }} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{t('settings.statValueEn', 'القيمة (انجليزي)')}</Label>
                    <Input 
                      className="h-9 bg-white" 
                      value={stat.valueEn} 
                      onChange={(e) => {
                        const newStats = [...form.stats];
                        newStats[index].valueEn = e.target.value;
                        setForm({ ...form, stats: newStats });
                      }} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{t('settings.statLabelAr', 'النص (عربي) - مثلا سنة خبرة')}</Label>
                    <Input 
                      className="h-9 bg-white" 
                      value={stat.labelAr} 
                      onChange={(e) => {
                        const newStats = [...form.stats];
                        newStats[index].labelAr = e.target.value;
                        setForm({ ...form, stats: newStats });
                      }} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{t('settings.statLabelEn', 'النص (انجليزي)')}</Label>
                    <Input 
                      className="h-9 bg-white" 
                      value={stat.labelEn} 
                      onChange={(e) => {
                        const newStats = [...form.stats];
                        newStats[index].labelEn = e.target.value;
                        setForm({ ...form, stats: newStats });
                      }} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{t('settings.statLabelKu', 'النص (كردي)')}</Label>
                    <Input 
                      className="h-9 bg-white" 
                      value={stat.labelKu} 
                      onChange={(e) => {
                        const newStats = [...form.stats];
                        newStats[index].labelKu = e.target.value;
                        setForm({ ...form, stats: newStats });
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
                stats: [...form.stats, { valueAr: '', valueEn: '', labelAr: '', labelEn: '', labelKu: '' }] 
              })}
            >
              <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('settings.addStat', 'إضافة إحصائية')}
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
