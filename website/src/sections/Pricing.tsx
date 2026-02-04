const plans = [
  {
    name: "Free",
    price: "$0",
    priceSuffix: "/month",
    subtitle: "For small teams getting started",
    highlighted: false,
    dark: false,
    features: [
      "5 creators",
      "1 workspace",
      "Basic curation workflow",
      "Manual blast radius",
      "Coherence score",
      "1 hackathon per quarter",
      "Community support",
      "30-day audit log",
    ],
    checkColor: "text-surface-400",
    textColor: "text-surface-600",
    cta: "Get Started",
    ctaClass:
      "w-full py-3 rounded-xl border border-surface-300 text-surface-700 hover:bg-surface-50 font-medium transition-colors",
  },
  {
    name: "Starter",
    price: "$29",
    priceSuffix: "/user/mo",
    subtitle: "For growing teams with active curation",
    highlighted: false,
    dark: false,
    features: [
      "25 creators",
      "3 workspaces",
      "Full curation workflow",
      "Automated blast radius",
      "Coherence score + flags",
      "Unlimited hackathons",
      "Email support",
      "90-day audit log",
    ],
    checkColor: "text-primary-400",
    textColor: "text-surface-600",
    cta: "Get Started",
    ctaClass:
      "w-full py-3 rounded-xl border border-surface-300 text-surface-700 hover:bg-surface-50 font-medium transition-colors",
  },
  {
    name: "Professional",
    price: "$79",
    priceSuffix: "/user/mo",
    subtitle: "For teams serious about production quality",
    highlighted: true,
    dark: false,
    features: [
      "Unlimited creators",
      "10 workspaces",
      "Full workflow + analytics",
      "Automated blast radius + CI integration",
      "Coherence patterns + trends",
      "Unlimited hackathons",
      "Priority support",
      "SSO / SAML",
      "1-year audit log",
      "US & EU data residency",
    ],
    checkColor: "text-primary-500",
    textColor: "text-surface-600",
    cta: "Start Free Trial",
    ctaClass:
      "w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors",
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceSuffix: "",
    subtitle: "For large organizations with complex needs",
    highlighted: false,
    dark: true,
    features: [
      "Unlimited everything",
      "Unlimited workspaces",
      "Custom curation rules",
      "Custom blast radius rules",
      "Custom coherence patterns",
      "Unlimited hackathons",
      "Dedicated CSM",
      "SSO / SAML / OIDC",
      "Unlimited audit log",
      "Custom data residency",
    ],
    checkColor: "text-accent-400",
    textColor: "text-surface-300",
    cta: "Contact Sales",
    ctaClass:
      "w-full py-3 rounded-xl border border-surface-500 hover:border-accent-400 text-white font-medium transition-colors",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-accent-600 font-semibold tracking-widest text-sm uppercase mb-4">
            PRICING
          </p>
          <h2 className="text-4xl font-bold text-surface-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-surface-500">
            Start free. Scale as you grow.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col ${
                plan.dark
                  ? "bg-surface-900 text-white"
                  : plan.highlighted
                    ? "bg-white border-2 border-primary-500 shadow-xl relative"
                    : "bg-white border border-surface-200"
              }`}
            >
              {/* Most Popular badge */}
              {plan.highlighted && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              {/* Plan Name */}
              <h3
                className={`text-xl font-bold ${
                  plan.dark ? "text-white" : "text-surface-900"
                }`}
              >
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <span
                  className={`text-4xl font-bold ${
                    plan.dark ? "text-white" : "text-surface-900"
                  }`}
                >
                  {plan.price}
                </span>
                {plan.priceSuffix && (
                  <span
                    className={`text-base ${
                      plan.dark ? "text-surface-400" : "text-surface-400"
                    }`}
                  >
                    {plan.priceSuffix}
                  </span>
                )}
              </div>

              {/* Subtitle */}
              <p
                className={`text-sm mb-6 mt-2 ${
                  plan.dark ? "text-surface-400" : "text-surface-500"
                }`}
              >
                {plan.subtitle}
              </p>

              {/* Divider */}
              <div
                className={`border-t my-6 ${
                  plan.dark ? "border-surface-700" : "border-surface-200"
                }`}
              />

              {/* Feature List */}
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className={`${plan.checkColor} shrink-0`}>
                      &#10003;
                    </span>
                    <span className={`${plan.textColor} text-sm`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button className={`mt-8 ${plan.ctaClass}`}>{plan.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
