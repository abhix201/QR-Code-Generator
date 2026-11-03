import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useToast } from '../hooks/useToast';

/** Shows a banner when a new version is installed and waiting. */
export function UpdatePrompt() {
    const toast = useToast();
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        offlineReady: [offlineReady, setOfflineReady],
        updateServiceWorker
    } = useRegisterSW();

    useEffect(() => {
        if (offlineReady) {
            toast('Ready to work offline.');
            setOfflineReady(false);
        }
    }, [offlineReady, setOfflineReady, toast]);

    if (!needRefresh) return null;
    return (
        <div className="update-bar" role="status">
            <span>A new version is ready.</span>
            <button type="button" className="button button--primary" onClick={() => updateServiceWorker(true)}>
                Reload
            </button>
            <button type="button" className="link-button" onClick={() => setNeedRefresh(false)}>
                Later
            </button>
        </div>
    );
}
