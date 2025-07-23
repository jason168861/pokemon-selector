document.addEventListener('DOMContentLoaded', () => {

    // --- DOM 元素定義 ---
    const POKEMON_COUNT = 1035;
    const pokemonContainer = document.getElementById('pokemon-container');
    const selectedIdsOutput = document.getElementById('selected-ids');

    // ✨ 新增：取得搜尋框的元素
    const searchInput = document.getElementById('search-input');

    // (按鈕與核取方塊的元素定義維持不變)
    const startersButton = document.getElementById('select-starters');
    const pseudosButton = document.getElementById('select-pseudos');
    const evolvedButton = document.getElementById('select-evolved');
    const clearButton = document.getElementById('clear-all');
    const includeStarterEvolutionsCheckbox = document.getElementById('include-starter-evolutions');
    const includePseudoEvolutionsCheckbox = document.getElementById('include-pseudo-evolutions');

    let selectedPokemon = new Set();

    // --- 資料定義 ---

    // ✨ 新增：寶可夢名稱列表 (英文小寫，用於搜尋比對)
    // 這是讓名稱搜尋能夠快速運作的關鍵！


    // 御三家資料：分成「只有基礎」和「包含家族」兩種
    const STARTERS_BASE_IDS = [
        // Gen 1-3
        1, 4, 7, 152, 155, 158, 252, 255, 258,
        // Gen 4
        387, 390, 393,
        // Gen 5
        495, 498, 501,
        // Gen 6
        650, 653, 656,
        // Gen 7
        722, 725, 728,
        // Gen 8
        810, 813, 816,
        // Gen 9
        906, 909, 912,
    ];
    const STARTER_FAMILIES_IDS = [
        // Gen 1-3
        1, 2, 3, 4, 5, 6, 7, 8, 9, 152, 153, 154, 155, 156, 157, 158, 159, 160,
        252, 253, 254, 255, 256, 257, 258, 259, 260,
        // Gen 4
        387, 388, 389, 390, 391, 392, 393, 394, 395,
        // Gen 5
        495, 496, 497, 498, 499, 500, 501, 502, 503,
        // Gen 6
        650, 651, 652, 653, 654, 655, 656, 657, 658,
        // Gen 7
        722, 723, 724, 725, 726, 727, 728, 729, 730,
        // Gen 8
        810, 811, 812, 813, 814, 815, 816, 817, 818,
        // Gen 9
        906, 907, 908, 909, 910, 911, 912, 913, 914,
    ];

    const PSEUDOS_BASE_IDS = [
        // Gen 1-3
        147, 246, 371, 374,
        // Gen 4
        443,
        // Gen 5
        633,
        // Gen 6
        704,
        // Gen 7
        782,
        // Gen 8
        885,
        // Gen 9
        996,
    ];
    const PSEUDO_FAMILIES_IDS = [
        // Gen 1-3
        147, 148, 149, 246, 247, 248, 371, 372, 373, 374, 375, 376,
        // Gen 4
        443, 444, 445,
        // Gen 5
        633, 634, 635,
        // Gen 6
        704, 705, 706,
        // Gen 7
        782, 783, 784,
        // Gen 8
        885, 886, 887,
        // Gen 9
        996, 997, 998,
    ];
    
    // 所有基礎型態的寶可夢 (用於「勾選所有進化型態」按鈕)
    const BASE_FORM_IDS = new Set([
        1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 83, 84, 86, 88, 90, 92, 95, 96, 98, 100, 102, 104, 106, 107, 108, 109, 111, 113, 114, 115, 116, 118, 120, 122, 123, 124, 125, 126, 127, 128, 129, 131, 132, 133, 137, 138, 140, 142, 143, 144, 145, 146, 147, 150, 151, 152, 155, 158, 161, 163, 165, 167, 170, 172, 173, 174, 175, 177, 179, 183, 185, 187, 190, 191, 193, 194, 198, 200, 201, 202, 203, 204, 206, 207, 209, 211, 213, 214, 215, 216, 218, 220, 222, 223, 225, 226, 227, 228, 231, 234, 235, 236, 238, 239, 240, 241, 242, 243, 244, 245, 246, 249, 250, 251, 252, 255, 258, 261, 263, 265, 270, 273, 276, 278, 280, 283, 285, 287, 290, 293, 296, 298, 299, 300, 302, 303, 304, 307, 309, 311, 312, 313, 314, 315, 316, 318, 320, 322, 324, 325, 327, 328, 331, 333, 335, 336, 337, 338, 339, 341, 343, 345, 347, 349, 351, 352, 353, 355, 357, 358, 359, 360, 361, 363, 366, 369, 370, 371, 374, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 390, 393, 396, 399, 401, 403, 406, 408, 410, 412, 415, 417, 418, 420, 422, 424, 425, 427, 431, 433, 434, 436, 438, 439, 440, 441, 442, 443, 446, 447, 449, 451, 453, 455, 456, 458, 459, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 491, 492, 493, 494, 495, 498, 501, 504, 506, 509, 511, 513, 515, 517, 519, 522, 524, 527, 529, 531, 532, 535, 538, 539, 540, 543, 546, 548, 550, 551, 554, 556, 557, 559, 561, 562, 564, 566, 568, 570, 572, 574, 577, 580, 582, 585, 587, 588, 590, 592, 594, 595, 597, 599, 602, 605, 607, 610, 613, 615, 616, 618, 619, 621, 622, 624, 626, 627, 629, 631, 632, 633, 636, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 653, 656, 659, 661, 664, 667, 669, 672, 674, 676, 677, 679, 682, 684, 686, 688, 690, 692, 694, 696, 698, 701, 702, 703, 704, 707, 708, 710, 712, 714, 716, 717, 718, 719, 720, 721, 722, 725, 728, 731, 734, 736, 739, 741, 742, 744, 746, 747, 749, 751, 753, 755, 757, 759, 761, 764, 765, 766, 767, 769, 771, 772, 773, 774, 775, 776, 777, 778, 779, 781, 782, 785, 786, 787, 788, 789, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 813, 816, 819, 821, 824, 827, 829, 831, 833, 835, 837, 840, 843, 845, 846, 848, 850, 852, 854, 856, 859, 862, 863, 864, 865, 866, 867, 868, 869, 870, 871, 872, 874, 875, 876, 877, 878, 880, 881, 882, 883, 884, 885, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899, 900, 901, 902, 903, 904, 905, 906, 909, 912, 915, 917, 919, 921, 924, 926, 928, 931, 932, 934, 935, 938, 940, 942, 944, 946, 948, 950, 951, 953, 955, 957, 960, 962, 965, 967, 968, 969, 971, 973, 976, 978, 980, 981, 982, 983, 984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 996, 999, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1014, 1016, 1017, 1018, 1020, 1021, 1022, 1023, 1024, 1025
    ]);

    // --- 函式定義 ---
    function updateOutput() {
        const sortedIds = Array.from(selectedPokemon).sort((a, b) => a - b);
        selectedIdsOutput.textContent = sortedIds.join(',');
    }
function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const allPokemonImages = pokemonContainer.querySelectorAll('img');

    allPokemonImages.forEach(img => {
        const pokemonId = img.dataset.id;
        const pokemonName = img.dataset.name;
        let isMatch = false;

        if (searchTerm === '') {
            // 如果搜尋框是空的，顯示所有寶可夢
            isMatch = true;
        } else if (!isNaN(searchTerm) && searchTerm.length > 0) {
            // ✨ 修改點：如果輸入的是數字，進行「絕對等於」比對
            // 將 .startsWith() 改為 === 
            isMatch = (pokemonId === searchTerm);
        } else {
            // 如果輸入的是文字（包含中文），維持部分字詞比對 (includes)
            isMatch = pokemonName.includes(searchTerm);
        }

        // 根據是否匹配，來決定顯示或隱藏圖片
        img.style.display = isMatch ? '' : 'none';
    });
}
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
    
    function selectEvolvedForms() {
        const evolvedIds = [];
        for (let i = 1; i <= POKEMON_COUNT; i++) {
            if (!BASE_FORM_IDS.has(i)) {
                evolvedIds.push(i);
            }
        }
        batchSelect(evolvedIds);
    }

    function clearAllSelections() {
        selectedPokemon.clear();
        const allSelectedImages = document.querySelectorAll('.pokemon-grid img.selected');
        allSelectedImages.forEach(img => img.classList.remove('selected'));
        updateOutput();
    }

    // --- 初始設定與事件監聽 ---
    // 迴圈生成所有寶可夢圖片
      for (let i = 1; i <= POKEMON_COUNT; i++) {
        const img = document.createElement('img');
        const pokemonId = i;
        // ✨ 從名稱列表中取得對應的名稱 (注意陣列索引是 id - 1)
        const pokemonName = POKEMON_NAMES[pokemonId - 1] || `pokemon-${pokemonId}`;

        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        img.alt = `Pokemon #${pokemonId}: ${pokemonName}`;
        img.dataset.id = pokemonId;
        // ✨ 將名稱也存入 data 屬性，方便搜尋時取用
        img.dataset.name = pokemonName;
        img.loading = 'lazy'; 
        img.addEventListener('click', handlePokemonClick);
        pokemonContainer.appendChild(img);
    }
    
    // ✨ 新增：監聽搜尋框的輸入事件，做到即時搜尋
    searchInput.addEventListener('input', handleSearch);

    // (其他按鈕事件監聽維持不變)
    startersButton.addEventListener('click', () => { const useFamilyData = includeStarterEvolutionsCheckbox.checked; const idsToSelect = useFamilyData ? STARTER_FAMILIES_IDS : STARTERS_BASE_IDS; batchSelect(idsToSelect); });
    pseudosButton.addEventListener('click', () => { const useFamilyData = includePseudoEvolutionsCheckbox.checked; const idsToSelect = useFamilyData ? PSEUDO_FAMILIES_IDS : PSEUDOS_BASE_IDS; batchSelect(idsToSelect); });
    evolvedButton.addEventListener('click', selectEvolvedForms);
    clearButton.addEventListener('click', clearAllSelections);
});