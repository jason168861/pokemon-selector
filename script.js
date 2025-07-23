document.addEventListener('DOMContentLoaded', () => {

    // --- DOM 元素定義 ---
    const POKEMON_COUNT = 386;
    const pokemonContainer = document.getElementById('pokemon-container');
    const selectedIdsOutput = document.getElementById('selected-ids');

    // 按鈕
    const startersButton = document.getElementById('select-starters');
    const pseudosButton = document.getElementById('select-pseudos');
    const evolvedButton = document.getElementById('select-evolved');
    const clearButton = document.getElementById('clear-all');

    // ✨ 新增：取得核取方塊的元素
    const includeStarterEvolutionsCheckbox = document.getElementById('include-starter-evolutions');
    const includePseudoEvolutionsCheckbox = document.getElementById('include-pseudo-evolutions');

    let selectedPokemon = new Set();

    // --- 資料定義 ---

    // ✨ 御三家資料：分成「只有基礎」和「包含家族」兩種
    const STARTERS_BASE_IDS = [1, 4, 7, 152, 155, 158, 252, 255, 258];
    const STARTER_FAMILIES_IDS = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 152, 153, 154, 155, 156, 157, 158, 159, 160,
        252, 253, 254, 255, 256, 257, 258, 259, 260,
    ];

    // ✨ 準神資料：也分成「只有基礎」和「包含家族」兩種
    const PSEUDOS_BASE_IDS = [147, 246, 371, 374];
    const PSEUDO_FAMILIES_IDS = [
        147, 148, 149, 246, 247, 248, 371, 372, 373, 374, 375, 376,
    ];
    
    // (其他資料定義維持不變)
    const BASE_FORM_IDS = new Set([
        1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 83, 84, 86, 88, 90, 92, 95, 96, 98, 100, 102, 104, 106, 107, 108, 109, 111, 113, 114, 115, 116, 118, 120, 122, 123, 124, 125, 126, 127, 128, 129, 131, 132, 133, 137, 138, 140, 142, 143, 147, 152, 155, 158, 161, 163, 165, 167, 170, 172, 173, 174, 175, 177, 179, 183, 185, 187, 190, 191, 193, 194, 198, 200, 202, 203, 204, 206, 207, 209, 211, 213, 214, 215, 216, 218, 220, 222, 223, 225, 226, 227, 228, 231, 234, 235, 236, 238, 239, 240, 241, 246, 252, 255, 258, 261, 263, 265, 270, 273, 276, 278, 280, 283, 285, 287, 290, 293, 296, 298, 299, 300, 302, 303, 304, 307, 309, 311, 312, 313, 314, 315, 316, 318, 320, 322, 324, 325, 327, 328, 331, 333, 335, 336, 337, 338, 339, 341, 343, 345, 347, 349, 351, 352, 353, 355, 357, 358, 359, 360, 361, 363, 366, 369, 370, 371, 374, 385, 386
    ]);

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
