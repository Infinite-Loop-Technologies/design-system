import { ClientOnly } from './client-only';

export default function PlaygroundPage() {
    return (
        <ClientOnly>
            <div>Playground Page</div>
        </ClientOnly>
    );
}
