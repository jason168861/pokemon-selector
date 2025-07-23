// 等待整個網頁文件載入完成後再執行
document.addEventListener('DOMContentLoaded', () => {

    // --- 變數定義 ---
    const POKEMON_COUNT = 386; // 我們先載入到三代 (紅寶石/藍寶石)
    const pokemonContainer = document.getElementById('pokemon-container');
    const startersButton = document.getElementById('select-starters');
    const pseudosButton = document.getElementById('select-pseudos');
    const evolvedButton = document.getElementById('select-evolved'); // ✨ 取得新按鈕的元素
    const clearButton = document.getElementById('clear-all');
    const selectedIdsOutput = document.getElementById('selected-ids');

    // 使用 Set 來儲存被選擇的寶可夢 ID
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

    // ✨ 新增：定義所有基礎型態的寶可夢 (第一階段或無進化的寶可夢)
    // 使用 Set 結構可以極大地提升查找效率
    const BASE_FORM_IDS = new Set([
        1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52,
        54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 83, 84, 86, 88, 90, 92, 95, 96, 98,
        100, 102, 104, 106, 107, 108, 109, 111, 113, 114, 115, 116, 118, 120, 122, 123, 124,
        125, 126, 127, 128, 129, 131, 132, 133, 137, 138, 140, 142, 143, 147, 152, 155, 158,
        161, 163, 165, 167, 170, 172, 173, 174, 175, 177, 179, 183, 185, 187, 190, 191, 193,
        194, 198, 200, 202, 203, 204, 206, 207, 209, 211, 213, 214, 215, 216, 218, 220, 222,
        223, 225, 226, 227, 228, 231, 234, 235, 236, 238, 239, 240, 241, 246, 252, 255, 258,
        261, 263, 265, 270, 273, 276, 278, 280, 283, 285, 287, 290, 293, 296, 298, 299, 300,
        302, 303, 304, 307, 309, 311, 312, 313, 314, 315, 316, 318, 320, 322, 324, 325, 327,
        328, 331, 333, 335, 336, 337, 338, 339, 341, 343, 345, 347, 349, 351, 352, 353, 355,
        357, 358, 359, 360, 361, 363, 366, 369, 370, 371, 374, 385, 386
    ]);


    // --- 函式定義 ---

    /**
     * 更新畫面下方顯示的已選擇編號列表
     */
    function updateOutput() {
        const sortedIds = Array.from(selectedPokemon).sort((a, b) => a - b);
        selectedIdsOutput.textContent = sortedIds.join(',');
    }

    /**
     * 處理點擊寶可夢圖片的事件
     * @param {Event} event - 點擊事件物件
     */
    function handlePokemonClick(event) {
        const img = event.target;
        const pokemonId = parseInt(img.dataset.id, 10);

        if (selectedPokemon.has(pokemonId)) {
            selectedPokemon.delete(pokemonId);
            img.classList.remove('selected');
        } else {
            selectedPokemon.add(pokemonId);
            img.classList.add('selected');
        }
        updateOutput();
    }
    
    /**
     * 根據傳入的 ID 列表，批次選擇寶可夢
     * @param {number[]} idList - 要選擇的寶可夢 ID 陣列
     */
    function batchSelect(idList) {
        idList.forEach(id => {
            selectedPokemon.add(id);
            const imgElement = document.querySelector(`img[data-id='${id}']`);
            if (imgElement) {
                imgElement.classList.add('selected');
            }
        });
        updateOutput();
    }
    
    /**
     * ✨ 新增：選擇所有進化型態寶可夢的函式
     */
    function selectEvolvedForms() {
        const evolvedIds = [];
        // 遍歷 1 到 POKEMON_COUNT
        for (let i = 1; i <= POKEMON_COUNT; i++) {
            // 如果當前的 ID 不在我們的「基礎型態」清單中，那它就是進化型態
            if (!BASE_FORM_IDS.has(i)) {
                evolvedIds.push(i);
            }
        }
        // 使用現有的批次選擇函式來處理
        batchSelect(evolvedIds);
    }

    /**
     * 清除所有選擇
     */
    function clearAllSelections() {
        selectedPokemon.clear();
        const allSelectedImages = document.querySelectorAll('.pokemon-grid img.selected');
        allSelectedImages.forEach(img => img.classList.remove('selected'));
        updateOutput();
    }


    // --- 初始設定與事件監聽 ---

    for (let i = 1; i <= POKEMON_COUNT; i++) {
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`;
        img.alt = `Pokemon #${i}`;
        img.dataset.id = i;
        img.loading = 'lazy'; 
        img.addEventListener('click', handlePokemonClick);
        pokemonContainer.appendChild(img);
    }
    
    startersButton.addEventListener('click', () => batchSelect(STARTERS_IDS));
    pseudosButton.addEventListener('click', () => batchSelect(PSEUDO_LEGENDARIES_IDS));
    evolvedButton.addEventListener('click', selectEvolvedForms); // ✨ 為新按鈕加上事件監聽
    clearButton.addEventListener('click', clearAllSelections);
});
