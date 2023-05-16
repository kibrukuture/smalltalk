export const metadata = {
  title: 'about spec page | tolbel Inc.',
  description: `some description about spec page. | tolbel Inc.`,
};

export default function SpecLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Spec Layout</h1>
      {children}
    </div>
  );
}
