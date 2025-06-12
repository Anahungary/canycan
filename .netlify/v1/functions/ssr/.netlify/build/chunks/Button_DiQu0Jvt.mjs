import { b as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, s as spreadAttributes, f as renderSlot, a as renderTemplate } from './astro/server_BYXCEbbA.mjs';
import 'clsx';

const $$Astro = createAstro("https://Balto.com");
const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    variant = "primary",
    size = "md",
    href,
    type = "button",
    fullWidth = false,
    disabled = false,
    class: className = "",
    ...rest
  } = Astro2.props;
  const variantClasses = {
    primary: "bg-[#AFC2D5] hover:bg-[#9DB3C6] ",
    secondary: "bg-[#F6B89E] hover:bg-[#E4A78E] ",
    outline: "bg-transparent border border-[#AFC2D5] text-[#AFC2D5] hover:bg-[#AFC2D5] hover:bg-opacity-10",
    text: "bg-transparent text-[#AFC2D5] hover:text-[#9DB3C6] hover:underline"
  };
  const sizeClasses = {
    sm: "text-xs py-1 px-2 rounded",
    md: "text-sm py-2 px-4 rounded-md",
    lg: "text-base py-3 px-6 rounded-lg"
  };
  const classes = [
    "font-medium transition-colors duration-200",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    className
  ].join(" ");
  return renderTemplate`${href ? renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute(classes, "class")}${spreadAttributes(rest)}>${renderSlot($$result, $$slots["default"])}</a>` : renderTemplate`<button${addAttribute(type, "type")}${addAttribute(classes, "class")}${addAttribute(disabled, "disabled")}${spreadAttributes(rest)}>${renderSlot($$result, $$slots["default"])}</button>`}`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/ui/Button.astro", void 0);

export { $$Button as $ };
