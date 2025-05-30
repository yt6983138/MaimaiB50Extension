document.addEventListener('DOMContentLoaded', function() {
    const fetchRecentBtn = document.getElementById('fetch-recent');
    const fetchBestBtn = document.getElementById('fetch-best');
    const status = document.getElementById('status');

    fetchRecentBtn.addEventListener('click', async () => {
        try {
            status.textContent = '正在載入最近記錄...';
            fetchRecentBtn.disabled = true;

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('maimaidx-eng.com')) {
                throw new Error('請先開啟 maimai DX 官方網站');
            }

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: async () => {
                    try {
                        console.log('🔄 開始載入最近記錄...');
                        
                        if (!ensureAbleToExecute()) {
                            throw new Error('請確認您在 maimai DX 官方網站上');
                        }
                        
                        const records = await getBasicRecords();
                        
                        // 觸發 content.js 中的顯示函數
                        if (typeof displayResults === 'function') {
                            displayResults('最近記錄', records);
                        } else {
                            console.log('最近記錄:', records);
                        }
                        
                        console.log(`✅ 成功載入 ${records.length} 筆最近記錄`);
                        
                    } catch (error) {
                        console.error('❌ 載入最近記錄失敗:', error);
                        if (typeof displayResults === 'function') {
                            displayResults('載入最近記錄失敗', []);
                        }
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
            status.textContent = '正在載入最佳成績...';
            fetchBestBtn.disabled = true;

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('maimaidx-eng.com')) {
                throw new Error('請先開啟 maimai DX 官方網站');
            }

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: async () => {
                    try {
                        console.log('🔄 開始載入最佳成績...');
                        console.log('⚠️ 此操作可能需要較長時間，請耐心等待...');
                        
                        if (!ensureAbleToExecute()) {
                            throw new Error('請確認您在 maimai DX 官方網站上');
                        }

                        await getBest50(500);
                        
                        // const records = await getAllRecordsBySearch(500);
                        
                        // // 觸發 content.js 中的顯示函數
                        // if (typeof displayResults === 'function') {
                        //     displayResults('最佳成績 (各難度前10名)', records);
                        // } else {
                        //     console.log('最佳成績:', records);
                        // }
                        
                        // console.log(`✅ 成功載入 ${records.length} 筆最佳成績`);

                        console.log(`✅ 成功載入最佳成績`);
                        
                    } catch (error) {
                        console.error('❌ 載入最佳成績失敗:', error);
                        if (typeof displayResults === 'function') {
                            displayResults('載入最佳成績失敗', []);
                        }
                    }
                }
            });

            status.textContent = '已觸發載入最佳成績，請查看網頁 Console';
        } catch (error) {
            status.textContent = '錯誤: ' + error.message;
        } finally {
            fetchBestBtn.disabled = false;
        }
    });
});