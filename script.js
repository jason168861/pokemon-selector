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


    // --- 函式定義 (維持不變) ---
    function updateOutput() { /* ... */ }
    function handlePokemonClick(event) { /* ... */ }
    function batchSelect(idList) { /* ... */ }
    function selectEvolvedForms() { /* ... */ }
    function clearAllSelections() { /* ... */ }
    // (為了節省篇幅，此處省略未變更的函式內容，請保留您檔案中原有的函式)
    function updateOutput(){const sortedIds=Array.from(selectedPokemon).sort((a,b)=>a-b);selectedIdsOutput.textContent=sortedIds.join(",")}function handlePokemonClick(event){const img=event.target;const pokemonId=parseInt(img.dataset.id,10);if(selectedPokemon.has(pokemonId)){selectedPokemon.delete(pokemonId);img.classList.remove("selected")}else{selectedPokemon.add(pokemonId);img.classList.add("selected")}updateOutput()}function batchSelect(idList){idList.forEach(id=>{selectedPokemon.add(id);const imgElement=document.querySelector(`img[data-id='${id}']`);if(imgElement){imgElement.classList.add("selected")}});updateOutput()}function selectEvolvedForms(){const evolvedIds=[];for(let i=1;i<=POKEMON_COUNT;i++){if(!BASE_FORM_IDS.has(i)){evolvedIds.push(i)}}batchSelect(evolvedIds)}function clearAllSelections(){selectedPokemon.clear();const allSelectedImages=document.querySelectorAll(".pokemon-grid img.selected");allSelectedImages.forEach(img=>img.classList.remove("selected"));updateOutput()}

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
    
    // ✨ 修改御三家按鈕的事件監聽
    startersButton.addEventListener('click', () => {
        // 檢查「包含進化型態」的核取方塊是否被打勾
        const useFamilyData = includeStarterEvolutionsCheckbox.checked;
        // 如果被打勾，就使用包含家族的資料；否則，只使用基礎型態的資料
        const idsToSelect = useFamilyData ? STARTER_FAMILIES_IDS : STARTERS_BASE_IDS;
        batchSelect(idsToSelect);
    });

    // ✨ 修改準神按鈕的事件監聽
    pseudosButton.addEventListener('click', () => {
        const useFamilyData = includePseudoEvolutionsCheckbox.checked;
        const idsToSelect = useFamilyData ? PSEUDO_FAMILIES_IDS : PSEUDOS_BASE_IDS;
        batchSelect(idsToSelect);
    });

    // (其他按鈕事件監聽維持不變)
    evolvedButton.addEventListener('click', selectEvolvedForms);
    clearButton.addEventListener('click', clearAllSelections);
});
