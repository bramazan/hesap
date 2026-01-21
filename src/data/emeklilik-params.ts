// Emeklilik Hesaplama Parametreleri
// Kaynak: SGK, 5510 sayılı Kanun, 506 sayılı Kanun

// EYT (Emeklilikte Yaşa Takılanlar) için kritik tarih
export const EYT_CRITICAL_DATE = new Date(1999, 8, 9); // 09.09.1999

// 5510 sayılı kanun yürürlük tarihi
export const SSK_5510_DATE = new Date(2008, 9, 1); // 01.10.2008

// Geçiş dönemi tarihi
export const TRANSITION_DATE = new Date(1999, 8, 8); // 08.09.1999

// Hizmet Statüleri
export type ServiceStatus = "4A" | "4B" | "4C";

export interface ServiceStatusInfo {
    id: ServiceStatus;
    name: string;
    fullName: string;
    description: string;
}

export const SERVICE_STATUSES: ServiceStatusInfo[] = [
    { id: "4A", name: "4A (SSK)", fullName: "Sigortalı Çalışan", description: "Özel sektör veya kamu işçisi" },
    { id: "4B", name: "4B (Bağ-Kur)", fullName: "Bağımsız Çalışan", description: "Esnaf, serbest meslek" },
    { id: "4C", name: "4C (Emekli Sandığı)", fullName: "Devlet Memuru", description: "Kamu görevlisi" },
];

// Emeklilik şartları (5510 sonrası - temel şartlar)
export interface RetirementRequirement {
    status: ServiceStatus;
    minDays: number; // Minimum prim gün sayısı
    minInsuranceYears?: number; // Minimum sigortalılık süresi (yıl)
}

export const RETIREMENT_REQUIREMENTS_5510: RetirementRequirement[] = [
    { status: "4A", minDays: 7200 }, // 7200 gün = 20 yıl
    { status: "4B", minDays: 9000 }, // 9000 gün = 25 yıl
    { status: "4C", minDays: 9000 }, // 9000 gün = 25 yıl
];

// Geçiş dönemi şartları (1999-2008 arası)
export const RETIREMENT_REQUIREMENTS_TRANSITION: RetirementRequirement[] = [
    { status: "4A", minDays: 7000 },
    { status: "4B", minDays: 9000 },
    { status: "4C", minDays: 9000 },
];

// EYT şartları (09.09.1999 öncesi)
export interface EYTRequirement {
    gender: "male" | "female";
    minInsuranceYears: number; // Sigortalılık süresi (yıl)
    minDays: number; // Minimum prim günü
}

export const EYT_REQUIREMENTS: EYTRequirement[] = [
    { gender: "female", minInsuranceYears: 20, minDays: 5000 },
    { gender: "male", minInsuranceYears: 25, minDays: 5000 },
];

// Yaş şartları tablosu (prim günü tamamlama yılına göre)
// 5510 sonrası kademeli yaş artışı
export interface AgeRequirement {
    yearFrom: number;
    yearTo: number;
    femaleAge: number;
    maleAge: number;
}

export const AGE_REQUIREMENTS: AgeRequirement[] = [
    { yearFrom: 2008, yearTo: 2035, femaleAge: 58, maleAge: 60 },
    { yearFrom: 2036, yearTo: 2037, femaleAge: 59, maleAge: 61 },
    { yearFrom: 2038, yearTo: 2039, femaleAge: 60, maleAge: 62 },
    { yearFrom: 2040, yearTo: 2041, femaleAge: 61, maleAge: 63 },
    { yearFrom: 2042, yearTo: 2043, femaleAge: 62, maleAge: 64 },
    { yearFrom: 2044, yearTo: 2999, femaleAge: 65, maleAge: 65 },
];

// Geçiş dönemi (1999-2008) yaş şartları
export const AGE_REQUIREMENTS_TRANSITION: AgeRequirement[] = [
    { yearFrom: 1999, yearTo: 2007, femaleAge: 58, maleAge: 60 },
    { yearFrom: 2008, yearTo: 2999, femaleAge: 58, maleAge: 60 },
];

// Yardımcı fonksiyonlar
export const getRequiredAge = (
    completionYear: number,
    gender: "male" | "female",
    firstInsuranceDate: Date
): number => {
    // EYT kontrolü - 09.09.1999 öncesi ise yaş şartı yok
    if (firstInsuranceDate < EYT_CRITICAL_DATE) {
        return 0; // Yaş şartı yok
    }

    // Geçiş dönemi (1999-2008)
    if (firstInsuranceDate >= EYT_CRITICAL_DATE && firstInsuranceDate < SSK_5510_DATE) {
        const requirement = AGE_REQUIREMENTS_TRANSITION.find(
            (r) => completionYear >= r.yearFrom && completionYear <= r.yearTo
        );
        return requirement ? (gender === "female" ? requirement.femaleAge : requirement.maleAge) : 60;
    }

    // 5510 sonrası
    const requirement = AGE_REQUIREMENTS.find(
        (r) => completionYear >= r.yearFrom && completionYear <= r.yearTo
    );
    return requirement ? (gender === "female" ? requirement.femaleAge : requirement.maleAge) : 65;
};

export const getRequiredDays = (
    status: ServiceStatus,
    firstInsuranceDate: Date
): number => {
    // EYT kontrolü
    if (firstInsuranceDate < EYT_CRITICAL_DATE) {
        return 5000; // EYT için genel minimum
    }

    // Geçiş dönemi
    if (firstInsuranceDate >= EYT_CRITICAL_DATE && firstInsuranceDate < SSK_5510_DATE) {
        const req = RETIREMENT_REQUIREMENTS_TRANSITION.find((r) => r.status === status);
        return req?.minDays ?? 7000;
    }

    // 5510 sonrası
    const req = RETIREMENT_REQUIREMENTS_5510.find((r) => r.status === status);
    return req?.minDays ?? 7200;
};

export const getRequiredInsuranceYears = (
    gender: "male" | "female",
    firstInsuranceDate: Date
): number => {
    // EYT kontrolü
    if (firstInsuranceDate < EYT_CRITICAL_DATE) {
        return gender === "female" ? 20 : 25;
    }

    // Normal dönem için sigortalılık süresi şartı gerekmez (gün şartı yeterli)
    return 0;
};

// Tarih yardımcı fonksiyonları
export const addYears = (date: Date, years: number): Date => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
};

export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const daysBetween = (date1: Date, date2: Date): number => {
    const diff = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const yearsBetween = (date1: Date, date2: Date): number => {
    const diff = date2.getTime() - date1.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

export const formatDateTR = (date: Date): string => {
    return date.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};
