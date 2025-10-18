import * as React from 'react';
import dynamic from 'next/dynamic';

type Block = {
    key: string;
    title: string;
    minH?: number;
    Comp: React.ComponentType;
};

const blocks: Block[] = [
    {
        key: 'hello',
        title: 'A simple hello world component',
        minH: 400,
        Comp: dynamic(() =>
            import('@/registry/new-york/blocks/hello-world/hello-world').then(
                (m) => m.HelloWorld
            )
        ),
    },
    {
        key: 'form',
        title: 'A contact form with Zod validation.',
        minH: 500,
        Comp: dynamic(() =>
            import('@/registry/new-york/blocks/example-form/example-form').then(
                (m) => m.ExampleForm
            )
        ),
    },
    {
        key: 'pokemon',
        title: 'A complex component showing hooks, libs and components.',
        minH: 400,
        Comp: dynamic(() =>
            import('@/registry/new-york/blocks/complex-component/page').then(
                (m) => m.default
            )
        ),
    },
    {
        key: 'card',
        title: 'A login form with a CSS file.',
        minH: 400,
        Comp: dynamic(() =>
            import(
                '@/registry/new-york/blocks/example-with-css/example-card'
            ).then((m) => m.ExampleCard)
        ),
    },
];

function DemoCard({
    title,
    minH = 400,
    children,
}: {
    title: string;
    minH?: number;
    children: React.ReactNode;
}) {
    return (
        <section
            className='flex flex-col gap-4 border rounded-lg p-4 relative'
            style={{ minHeight: 450 }}>
            <div className='flex items-center justify-between'>
                <h2 className='text-sm text-muted-foreground sm:pl-3'>
                    {title}
                </h2>
            </div>
            <div
                className='flex items-center justify-center relative'
                style={{ minHeight: minH }}>
                {children}
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <div className='max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8'>
            <header className='flex flex-col gap-1'>
                <h1 className='text-3xl font-bold tracking-tight'>
                    Infinite Loop Technologies Registry
                </h1>
                <p className='text-muted-foreground'>
                    A custom registry for distributing code using shadcn.
                </p>
            </header>

            <main className='flex flex-col flex-1 gap-8'>
                {blocks.map(({ key, title, minH, Comp }) => (
                    <DemoCard key={key} title={title} minH={minH}>
                        <React.Suspense
                            fallback={
                                <div className='text-muted-foreground'>
                                    Loading…
                                </div>
                            }>
                            <Comp />
                        </React.Suspense>
                    </DemoCard>
                ))}
            </main>
        </div>
    );
}
