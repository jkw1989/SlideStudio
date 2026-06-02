import { ChevronRightIcon } from "./Icons";

export const Label = ({ children, className = "" }) => (
    <label
        className={`block text-[11px] font-normal uppercase tracking-[0.08em] mb-.5 font-display text-ink ${className}`}
    >
        {children}
    </label>
);

export const Hint = ({ children }) => (
    <span className="block text-[13px] mb-2 text-ink-mute">{children}</span>
);

export const Input = ({ ...props }) => (
    <input
        {...props}
        className="input-element h-8 w-full px-2 text-[13px] font-medium outline-none transition-colors"
    />
);

export const Select = ({ children, ...props }) => (
    <select
        {...props}
        className="select-element h-8 w-full px-3 text-[13px] font-medium outline-none transition-colors appearance-none"
    >
        {children}
    </select>
);

export const Btn = ({
    children,
    variant = "primary",
    className = "",
    ...props
}) => {
    const isPrimary = variant === "primary";
    const baseClass = isPrimary ? "btn-primary" : "btn-secondary";

    return (
        <button
            {...props}
            className={`${baseClass} px-[22px] py-[8px] inline-flex items-center justify-center gap-[10px] text-[12px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed group ${className}`}
        >
            {children}
            {isPrimary && (
                <span className="transition-transform group-hover:translate-x-[3px]">
                    <ChevronRightIcon size={18} />
                </span>
            )}
        </button>
    );
};

export const Slider = ({
    label,
    value,
    min,
    max,
    onChange,
    className = "",
}) => (
    <div className={`mb-2 ${className} flex items-center gap-2`}>
        <Label className="!mb-0 w-20 shrink-0">{label}</Label>
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            className="brutalist-slider flex-grow"
        />
        <span className="font-bold text-[13px] w-6 text-right shrink-0 font-mono text-ink">
            {value}
        </span>
    </div>
);

export const Section = ({
    title,
    subtitle,
    children,
    hasDivider = true,
    className = "",
}) => (
    <div
        className={`mb-8 pb-1 ${className} ${hasDivider ? "border-b border-line" : ""}`}
    >
        <div className="flex items-baseline gap-1 mb-1">
            <span className="text-[12px] font-bold mb-0 uppercase tracking-tight font-display text-ink">
                {title}
            </span>
            {subtitle && (
                <p className="text-[12px] m-0 font-normal text-ink-mute ml-auto">
                    {subtitle}
                </p>
            )}
        </div>
        {children}
    </div>
);
