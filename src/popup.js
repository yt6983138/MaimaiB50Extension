document.addEventListener('DOMContentLoaded', function() {
    const fetchRecentBtn = document.getElementById('fetch-recent');
    const fetchBestBtn = document.getElementById('fetch-best');
    const status = document.getElementById('status');

    const MAIMAI_HOST = "maimaidx-eng.com";

    fetchRecentBtn.addEventListener('click', async () => {
        try {
            status.textContent = '正在載入最近記錄...';
            fetchRecentBtn.disabled = true;

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            // check does the tab is on maimai or chunithm
            if (!tab.url.includes(MAIMAI_HOST)) {
                throw new Error('請先開啟 maimai DX 官方網站');
            }

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: async () => {
                    try {
                        console.log('🔄 開始載入最近記錄...');

                        mai2_RecentRecords()
                    } catch (error) {
                        status.textContent = '錯誤: ' + error.message;
                    }
                }
            });

            status.textContent = '已觸發載入最近記錄，請查看網頁 Console';
        } catch (error) {
            status.textContent = '錯誤: ' + error.message;
        } finally {
            fetchRecentBtn.disabled = false;
        }
    });

    fetchBestBtn.addEventListener('click', async () => {
        try {
            status.textContent = '正在載入最近記錄...';
            fetchBestBtn.disabled = true;

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            // check does the tab is on maimai or chunithm
            if (!tab.url.includes(MAIMAI_HOST)) {
                throw new Error('請先開啟 maimai DX 官方網站');
            }

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: async () => {
                    try {
                        console.log('🔄 開始載入最佳記錄...');

                        mai2_BestRecords()
                    } catch (error) {
                        status.textContent = '錯誤: ' + error.message;
                    }
                }
            });

            status.textContent = '已觸發載入最佳記錄，請查看網頁 Console';
        } catch (error) {
            status.textContent = '錯誤: ' + error.message;
        } finally {
            fetchBestBtn.disabled = false;
        }
    });
});