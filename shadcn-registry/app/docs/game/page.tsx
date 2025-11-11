import {
    DocsPage,
    DocsPageHeader,
    PageTitle,
    PageDescription,
    PageActions,
    ExamplePreview,
} from '@/components/docs-page';

export default function GamePage() {
    return (
        <>
            <DocsPage>
                <DocsPageHeader>
                    <PageTitle>Game</PageTitle>
                    <PageDescription>
                        loop-kit is also a badass game engine.
                    </PageDescription>
                    <PageActions />
                </DocsPageHeader>
                <p>Docs are awesome!!</p>
                <ExamplePreview />
                <ExamplePreview />
            </DocsPage>
        </>
    );
}
