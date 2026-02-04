export default function Footer() {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Use Cases', href: '#usecases' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Comparison', href: '#comparison' },
        { label: 'Changelog', href: '#' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { label: 'Creation Registry', href: '#' },
        { label: 'Curation Workflow', href: '#' },
        { label: 'Blast Radius Engine', href: '#' },
        { label: 'Coherence Dashboard', href: '#' },
        { label: 'Ownership Registry', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'API Reference', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Community', href: '#' },
        { label: 'Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-surface-950 text-surface-400 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-accent-400 text-lg">&#9670;</span>
              <span className="text-white font-bold text-xl">Curator</span>
            </div>
            <p className="text-surface-500 text-sm leading-relaxed">
              The production curation platform for AI-native development.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-surface-500 hover:text-surface-300 text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-surface-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-surface-600 text-sm">
            &copy; {currentYear} Curator. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-surface-600 hover:text-surface-400 transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-surface-600 hover:text-surface-400 transition-colors text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-surface-600 hover:text-surface-400 transition-colors text-sm"
            >
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
