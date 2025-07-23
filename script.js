// 等待整個網頁文件載入完成後再執行
document.addEventListener('DOMContentLoaded', () => {

    // --- 變數定義 ---
    const POKEMON_COUNT = 386; // 我們先載入到三代 (紅寶石/藍寶石)
    const pokemonContainer = document.getElementById('pokemon-container');
    const startersButton = document.getElementById('select-starters');
    const pseudosButton = document.getElementById('select-pseudos');
    const clearButton = document.getElementById('clear-all');
    const selectedIdsOutput = document.getElementById('selected-ids');

    // 使用 Set 來儲存被選擇的寶可夢 ID，Set 會自動處理重複，且新增/刪除效能好
    let selectedPokemon = new Set();

    // --- 資料定義 ---
    // 御三家全國圖鑑編號
    const STARTERS_IDS = [
        1, 4, 7, // 關都
        152, 155, 158, // 城都
        252, 255, 258, // 豐緣
    ];

    // 準神及其所有進化型態的全國圖鑑編號
    const PSEUDO_LEGENDARIES_IDS = [
        147, 148, 149, // 快龍家族
        246, 247, 248, // 班基拉斯家族
        371, 372, 373, // 暴飛龍家族
        374, 375, 376, // 巨金怪家族
    ];

    // --- 函式定義 ---

    /**
     * 更新畫面下方顯示的已選擇編號列表
     */
    function updateOutput() {
        // 將 Set 轉換為陣列，並進行數字排序
        const sortedIds = Array.from(selectedPokemon).sort((a, b) => a - b);
        // 將陣列用逗號組合成字串，並更新到網頁上
        selectedIdsOutput.textContent = sortedIds.join(',');
    }

    /**
     * 處理點擊寶可夢圖片的事件
     * @param {Event} event - 點擊事件物件
     */
    function handlePokemonClick(event) {
        const img = event.target;
        // 從圖片的 data-id 屬性取得寶可夢編號 (字串)，並轉為數字
        const pokemonId = parseInt(img.dataset.id, 10);

        if (selectedPokemon.has(pokemonId)) {
            // 如果已經選過了，就取消選擇
            selectedPokemon.delete(pokemonId);
            img.classList.remove('selected');
        } else {
            // 如果還沒選過，就加入選擇
            selectedPokemon.add(pokemonId);
            img.classList.add('selected');
        }

        // 每次點擊後都更新一次輸出結果
        updateOutput();
    }
    
    /**
     * 根據傳入的 ID 列表，批次選擇寶可夢
     * @param {number[]} idList - 要選擇的寶可夢 ID 陣列
     */
    function batchSelect(idList) {
        idList.forEach(id => {
            // 將 ID 加入選擇清單
            selectedPokemon.add(id);
            // 找到對應的圖片元素
            const imgElement = document.querySelector(`img[data-id='${id}']`);
            if (imgElement) {
                // 為圖片加上 'selected' 的 class
                imgElement.classList.add('selected');
            }
        });
        // 更新輸出結果
        updateOutput();
    }

    /**
     * 清除所有選擇
     */
    function clearAllSelections() {
        // 清空 Set
        selectedPokemon.clear();
        // 移除所有圖片的 'selected' class
        const allSelectedImages = document.querySelectorAll('.pokemon-grid img.selected');
        allSelectedImages.forEach(img => img.classList.remove('selected'));
        // 更新輸出結果
        updateOutput();
    }


    // --- 初始設定與事件監聽 ---

    // 迴圈生成所有寶可夢圖片
    for (let i = 1; i <= POKEMON_COUNT; i++) {
        const img = document.createElement('img');
        // 使用 PokeAPI 提供的免費圖片資源
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`;
        img.alt = `Pokemon #${i}`;
        // 將寶可夢編號存在 data-id 屬性中，方便後續取用
        img.dataset.id = i;
        // 為每張圖片加上讀取延遲效果，避免圖片損壞時出現醜圖示
        img.loading = 'lazy'; 
        
        // 為每張圖片加上點擊事件監聽器
        img.addEventListener('click', handlePokemonClick);

        // 將圖片加入到容器中
        pokemonContainer.appendChild(img);
    }
    
    // 監聽 "勾選御三家" 按鈕的點擊事件
    startersButton.addEventListener('click', () => batchSelect(STARTERS_IDS));

    // 監聽 "勾選準神" 按鈕的點擊事件
    pseudosButton.addEventListener('click', () => batchSelect(PSEUDO_LEGENDARIES_IDS));
    
    // 監聽 "清除所有選擇" 按鈕的點擊事件
    clearButton.addEventListener('click', clearAllSelections);
});
