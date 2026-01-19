"use client";

import { useState, useCallback } from "react";

interface CalculatorProps {
    title: string;
    description: string;
    children: React.ReactNode;
    result: React.ReactNode | null;
}

export function Calculator({
    title,
    description,
    children,
    result,
}: CalculatorProps) {
    return (
        <div className="container">
            <header className="page-header">
                <h1 className="page-title">{title}</h1>
                <p className="page-description">{description}</p>
            </header>

            <div className="calculator-card">
                {children}
                {result}
            </div>
        </div>
    );
}

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    suffix?: string;
    type?: "text" | "number" | "date";
    min?: number;
    max?: number;
    step?: number;
}

export function InputField({
    label,
    value,
    onChange,
    placeholder,
    suffix,
    type = "text",
    min,
    max,
    step,
}: InputFieldProps) {
    return (
        <div className="input-group">
            <label className="input-label">{label}</label>
            <div className={suffix ? "input-suffix" : ""}>
                <input
                    type={type}
                    className="input-field"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    step={step}
                />
                {suffix && <span className="suffix">{suffix}</span>}
            </div>
        </div>
    );
}

interface ResultBoxProps {
    label: string;
    value: string;
    detail?: string;
}

export function ResultBox({ label, value, detail }: ResultBoxProps) {
    return (
        <div className="result-box">
            <div className="result-label">{label}</div>
            <div className="result-value">{value}</div>
            {detail && <div className="result-detail">{detail}</div>}
        </div>
    );
}

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    items: FAQItem[];
}

export function FAQSection({ items }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="section">
            <h2 className="section-title">❓ Sıkça Sorulan Sorular</h2>
            <div>
                {items.map((item, index) => (
                    <div key={index} className="faq-item">
                        <div
                            className="faq-question"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            {item.question}
                            <span>{openIndex === index ? "−" : "+"}</span>
                        </div>
                        {openIndex === index && (
                            <div className="faq-answer">{item.answer}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

interface RelatedLink {
    href: string;
    title: string;
}

interface RelatedLinksSectionProps {
    links: RelatedLink[];
}

export function RelatedLinksSection({ links }: RelatedLinksSectionProps) {
    return (
        <div className="section">
            <h2 className="section-title">🔗 İlgili Hesaplayıcılar</h2>
            <div className="related-links">
                {links.map((link, index) => (
                    <a key={index} href={link.href} className="related-link">
                        {link.title}
                    </a>
                ))}
            </div>
        </div>
    );
}

interface InfoSectionProps {
    title: string;
    children: React.ReactNode;
}

export function InfoSection({ title, children }: InfoSectionProps) {
    return (
        <div className="section">
            <h2 className="section-title">📝 {title}</h2>
            <div className="section-content">{children}</div>
        </div>
    );
}

// Utility hook for debounced calculations
export function useDebounce<T>(callback: (value: T) => void, delay: number) {
    const timeoutRef = { current: null as NodeJS.Timeout | null };

    return useCallback(
        (value: T) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => callback(value), delay);
        },
        [callback, delay]
    );
}

// Number formatting for Turkish locale
export function formatNumber(num: number, decimals: number = 2): string {
    return num.toLocaleString("tr-TR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

export function formatCurrency(num: number): string {
    return formatNumber(num) + " ₺";
}
