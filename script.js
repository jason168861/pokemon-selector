document.addEventListener('DOMContentLoaded', () => {

    // --- DOM 元素定義 ---
    const POKEMON_COUNT = 1035;
    const pokemonContainer = document.getElementById('pokemon-container');
    const selectedIdsOutput = document.getElementById('selected-ids');
    const searchInput = document.getElementById('search-input');

    const startersButton = document.getElementById('select-starters');
    const pseudosButton = document.getElementById('select-pseudos');
    const evolvedButton = document.getElementById('select-evolved');
    const clearButton = document.getElementById('clear-all');
    const includeStarterEvolutionsCheckbox = document.getElementById('include-starter-evolutions');
    const includePseudoEvolutionsCheckbox = document.getElementById('include-pseudo-evolutions');

    // 【新增】取得新按鈕的元素
    const selectAllShownButton = document.getElementById('select-all-shown');
    const showAllButton = document.getElementById('show-all');
    const megaButton = document.getElementById('select-mega');
    const includeMegaEvolutionsCheckbox = document.getElementById('include-mega-evolutions');

    const copyButton = document.getElementById('copy-button');
    let selectedPokemon = new Set();

    // --- 資料定義 (維持不變) ---
    // 御三家資料...
    const STARTERS_BASE_IDS = [1, 4, 7, 152, 155, 158, 252, 255, 258, 387, 390, 393, 495, 498, 501, 650, 653, 656, 722, 725, 728, 810, 813, 816, 906, 909, 912];
    const STARTER_FAMILIES_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 152, 153, 154, 155, 156, 157, 158, 159, 160, 252, 253, 254, 255, 256, 257, 258, 259, 260, 387, 388, 389, 390, 391, 392, 393, 394, 395, 495, 496, 497, 498, 499, 500, 501, 502, 503, 650, 651, 652, 653, 654, 655, 656, 657, 658, 722, 723, 724, 725, 726, 727, 728, 729, 730, 810, 811, 812, 813, 814, 815, 816, 817, 818, 906, 907, 908, 909, 910, 911, 912, 913, 914];
    // 準神資料...
    const PSEUDOS_BASE_IDS = [147, 246, 371, 374, 443, 633, 704, 782, 885, 996];
    const PSEUDO_FAMILIES_IDS = [147, 148, 149, 246, 247, 248, 371, 372, 373, 374, 375, 376, 443, 444, 445, 633, 634, 635, 704, 705, 706, 782, 783, 784, 885, 886, 887, 996, 997, 998];
    // 基礎型態資料...
    const BASE_FORM_IDS = new Set([1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 83, 84, 86, 88, 90, 92, 95, 96, 98, 100, 102, 104, 106, 107, 108, 109, 111, 113, 114, 115, 116, 118, 120, 122, 123, 124, 125, 126, 127, 128, 129, 131, 132, 133, 137, 138, 140, 142, 143, 144, 145, 146, 147, 150, 151, 152, 155, 158, 161, 163, 165, 167, 170, 172, 173, 174, 175, 177, 179, 183, 185, 187, 190, 191, 193, 194, 198, 200, 201, 202, 203, 204, 206, 207, 209, 211, 213, 214, 215, 216, 218, 220, 222, 223, 225, 226, 227, 228, 231, 234, 235, 236, 238, 239, 240, 241, 242, 243, 244, 245, 246, 249, 250, 251, 252, 255, 258, 261, 263, 265, 270, 273, 276, 278, 280, 283, 285, 287, 290, 293, 296, 298, 299, 300, 302, 303, 304, 307, 309, 311, 312, 313, 314, 315, 316, 318, 320, 322, 324, 325, 327, 328, 331, 333, 335, 336, 337, 338, 339, 341, 343, 345, 347, 349, 351, 352, 353, 355, 357, 358, 359, 360, 361, 363, 366, 369, 370, 371, 374, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 390, 393, 396, 399, 401, 403, 406, 408, 410, 412, 415, 417, 418, 420, 422, 424, 425, 427, 431, 433, 434, 436, 438, 439, 440, 441, 442, 443, 446, 447, 449, 451, 453, 455, 456, 458, 459, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 491, 492, 493, 494, 495, 498, 501, 504, 506, 509, 511, 513, 515, 517, 519, 522, 524, 527, 529, 531, 532, 535, 538, 539, 540, 543, 546, 548, 550, 551, 554, 556, 557, 559, 561, 562, 564, 566, 568, 570, 572, 574, 577, 580, 582, 585, 587, 588, 590, 592, 594, 595, 597, 599, 602, 605, 607, 610, 613, 615, 616, 618, 619, 621, 622, 624, 626, 627, 629, 631, 632, 633, 636, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 653, 656, 659, 661, 664, 667, 669, 672, 674, 676, 677, 679, 682, 684, 686, 688, 690, 692, 694, 696, 698, 701, 702, 703, 704, 707, 708, 710, 712, 714, 716, 717, 718, 719, 720, 721, 722, 725, 728, 731, 734, 736, 739, 741, 742, 744, 746, 747, 749, 751, 753, 755, 757, 759, 761, 764, 765, 766, 767, 769, 771, 772, 773, 774, 775, 776, 777, 778, 779, 781, 782, 785, 786, 787, 788, 789, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 813, 816, 819, 821, 824, 827, 829, 831, 833, 835, 837, 840, 843, 845, 846, 848, 850, 852, 854, 856, 859, 862, 863, 864, 865, 866, 867, 868, 869, 870, 871, 872, 874, 875, 876, 877, 878, 880, 881, 882, 883, 884, 885, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899, 900, 901, 902, 903, 904, 905, 906, 909, 912, 915, 917, 919, 921, 924, 926, 928, 931, 932, 934, 935, 938, 940, 942, 944, 946, 948, 950, 951, 953, 955, 957, 960, 962, 965, 967, 968, 969, 971, 973, 976, 978, 980, 981, 982, 983, 984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 996, 999, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1014, 1016, 1017, 1018, 1020, 1021, 1022, 1023, 1024, 1025]);
    const MEGA_EVO_BASE_IDS = [3, 6, 9, 15, 18, 65, 80, 94, 115, 127, 130, 142, 150, 181, 208, 212, 214, 229, 248, 254, 257, 260, 282, 302, 303, 306, 308, 310, 319, 323, 334, 354, 359, 362, 373, 376, 380, 381, 382, 383, 384, 428, 445, 448, 460, 475, 531, 719].sort((a, b) => a - b);
    // 【更新】包含完整超級進化家族（包含進化前型態）的 ID 列表，並補上 #719 帝安希
    const MEGA_EVO_FAMILY_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14, 15, 16, 17, 18, 63, 64, 65, 79, 80, 92, 93, 94, 95, 115, 123, 127, 129, 130, 142, 150, 179, 180, 181, 208, 212, 214, 228, 229, 246, 247, 248, 252, 253, 254, 255, 256, 257, 258, 259, 260, 280, 281, 282, 302, 303, 304, 305, 306, 307, 308, 309, 310, 318, 319, 322, 323, 333, 334, 353, 354, 359, 361, 362, 371, 372, 373, 374, 375, 376, 380, 381, 382, 383, 384, 427, 428, 443, 444, 445, 447, 448, 459, 460, 475, 531, 719].sort((a, b) => a - b);

    // --- 函式定義 ---
    function updateOutput() {
        const sortedIds = Array.from(selectedPokemon).sort((a, b) => a - b);
        selectedIdsOutput.textContent = sortedIds.join(',');
    }

    // 【修改】handleSearch 函式，在搜尋時要隱藏「全選當前顯示」按鈕
    function handleSearch() {
        // 當使用者手動搜尋時，代表特殊篩選模式結束，隱藏「全選當前顯示」按鈕
        selectAllShownButton.style.display = 'none';

        const rawInput = searchInput.value.toLowerCase();
        
        // 1. 用逗號分割輸入字串
        // 2. 對分割後的每個詞，使用 trim() 去除前後空格
        // 3. 過濾掉任何空字串 (例如輸入 "1, , 2" 時中間的空格)
        const searchTerms = rawInput.split(',')
            .map(term => term.trim())
            .filter(term => term.length > 0);

        const allPokemonCards = pokemonContainer.querySelectorAll('.pokemon-card');

        allPokemonCards.forEach(card => {
            // 如果處理後沒有有效的搜尋詞 (輸入框為空或只有逗號/空格)，則顯示所有寶可夢
            if (searchTerms.length === 0) {
                card.style.display = 'flex';
                return; // 繼續處理下一張卡片
            }

            const pokemonId = card.dataset.id;
            const pokemonName = card.dataset.name;

            // 使用 .some() 方法，檢查是否有任何一個搜尋詞匹配該卡片
            // .some() 會在找到第一個匹配項後立即回傳 true，效率較高
            const isMatch = searchTerms.some(term => {
                // 如果搜尋詞是純文字 (isNaN 結果為 true)，就進行名稱包含比對
                if (isNaN(term)) {
                    return pokemonName.includes(term);
                }
                // 如果搜尋詞是數字 (isNaN 結果為 false)，就進行編號完全比對
                return pokemonId === term;
            });

            // 根據是否匹配來決定顯示或隱藏卡片
            card.style.display = isMatch ? 'flex' : 'none';
        });
    }
    
    // handlePokemonClick 函式維持不變
    function handlePokemonClick(event) {
        const card = event.currentTarget;
        const pokemonId = parseInt(card.dataset.id, 10);

        if (selectedPokemon.has(pokemonId)) {
            selectedPokemon.delete(pokemonId);
            card.classList.remove('selected');
        } else {
            selectedPokemon.add(pokemonId);
            card.classList.add('selected');
        }
        updateOutput();
    }

    // batchSelect 函式維持不變
    function batchSelect(idList) {
        idList.forEach(id => {
            selectedPokemon.add(id);
            const cardElement = document.querySelector(`.pokemon-card[data-id='${id}']`);
            if (cardElement) {
                cardElement.classList.add('selected');
            }
        });
        updateOutput();
    }

    // selectEvolvedForms 函式維持不變
    function selectEvolvedForms() {
        const evolvedIds = [];
        for (let i = 1; i <= POKEMON_COUNT; i++) {
            if (!BASE_FORM_IDS.has(i)) {
                evolvedIds.push(i);
            }
        }
        batchSelect(evolvedIds);
    }

    // 【修改】clearAllSelections 函式，增加重置畫面的功能
    function clearAllSelections() {
        selectedPokemon.clear();
        const allSelectedCards = document.querySelectorAll('.pokemon-grid .pokemon-card.selected');
        allSelectedCards.forEach(card => card.classList.remove('selected'));
        updateOutput();

        // 清空搜尋框並觸發搜尋，這會讓所有寶可夢都顯示出來
        searchInput.value = '';
        handleSearch(); // handleSearch 內部會自動隱藏「全選當前顯示」按鈕
    }


    // --- 初始設定與事件監聽 ---
    // 迴圈生成寶可夢卡片 (維持不變)
    for (let i = 1; i <= POKEMON_COUNT; i++) {
        const pokemonId = i;
        const pokemonName = POKEMON_NAMES[pokemonId - 1] || `pokemon-${pokemonId}`;
        const card = document.createElement('div');
        card.classList.add('pokemon-card');
        card.dataset.id = pokemonId;
        card.dataset.name = pokemonName;
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        img.alt = `Pokemon #${pokemonId}: ${pokemonName}`;
        img.loading = 'lazy';
        const nameSpan = document.createElement('span');
        nameSpan.classList.add('pokemon-name');
        nameSpan.textContent = pokemonName;
        card.appendChild(img);
        card.appendChild(nameSpan);
        card.addEventListener('click', handlePokemonClick);
        pokemonContainer.appendChild(card);
    }
    
    searchInput.addEventListener('input', handleSearch);

    // 【修改】「御三家」按鈕的事件監聽器
    startersButton.addEventListener('click', () => {
        const useFamilyData = includeStarterEvolutionsCheckbox.checked;
        const idsToFilter = useFamilyData ? STARTER_FAMILIES_IDS : STARTERS_BASE_IDS;

        // 清空搜尋框，避免篩選衝突
        searchInput.value = '';

        const allPokemonCards = pokemonContainer.querySelectorAll('.pokemon-card');
        allPokemonCards.forEach(card => {
            const pokemonId = parseInt(card.dataset.id, 10);
            // 如果卡片的 ID 在要篩選的列表中，就顯示它，否則隱藏
            if (idsToFilter.includes(pokemonId)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        // 顯示「全選當前顯示」按鈕
        selectAllShownButton.style.display = 'inline-block';
    });

    // 【修改】「準神」按鈕的事件監聽器
    pseudosButton.addEventListener('click', () => {
        const useFamilyData = includePseudoEvolutionsCheckbox.checked;
        const idsToFilter = useFamilyData ? PSEUDO_FAMILIES_IDS : PSEUDOS_BASE_IDS;

        // 清空搜尋框，避免篩選衝突
        searchInput.value = '';

        const allPokemonCards = pokemonContainer.querySelectorAll('.pokemon-card');
        allPokemonCards.forEach(card => {
            const pokemonId = parseInt(card.dataset.id, 10);
            // 如果卡片的 ID 在要篩選的列表中，就顯示它，否則隱藏
            if (idsToFilter.includes(pokemonId)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        // 顯示「全選當前顯示」按鈕
        selectAllShownButton.style.display = 'inline-block';
    });
    
    // 【新增】為「全選當前顯示」按鈕添加事件監聽器
    selectAllShownButton.addEventListener('click', () => {
        const visibleCards = document.querySelectorAll('.pokemon-grid .pokemon-card');
        const idsToSelect = [];

        visibleCards.forEach(card => {
            // 確保只選取當前真正可見的卡片
            if (card.style.display !== 'none') {
                idsToSelect.push(parseInt(card.dataset.id, 10));
            }
        });

        batchSelect(idsToSelect);
    });
        showAllButton.addEventListener('click', () => {
        // 清空搜尋框
        searchInput.value = '';
        // 呼叫 handleSearch，因為搜尋框是空的，所以會顯示所有寶可夢
        handleSearch();
    });
    megaButton.addEventListener('click', () => {
        // 檢查 "包含進化型態" checkbox 是否被勾選
        const useFamilyData = includeMegaEvolutionsCheckbox.checked;
        // 根據 checkbox 狀態，決定要使用哪個 ID 列表
        const idsToFilter = useFamilyData ? MEGA_EVO_FAMILY_IDS : MEGA_EVO_BASE_IDS;

        // 清空搜尋框，避免篩選衝突
        searchInput.value = '';

        const allPokemonCards = pokemonContainer.querySelectorAll('.pokemon-card');
        allPokemonCards.forEach(card => {
            const pokemonId = parseInt(card.dataset.id, 10);
            // 如果卡片的 ID 在要篩選的列表中，就顯示它，否則隱藏
            if (idsToFilter.includes(pokemonId)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        // 顯示「全選當前顯示」按鈕
        selectAllShownButton.style.display = 'inline-block';
    });
    evolvedButton.addEventListener('click', selectEvolvedForms);
    clearButton.addEventListener('click', clearAllSelections);

    copyButton.addEventListener('click', () => {
    const textToCopy = selectedIdsOutput.textContent;

    // 如果沒有內容可以複製，則不執行任何動作
    if (!textToCopy) {
        alert('沒有可複製的編號！');
        return;
    }

    // 使用現代的 navigator.clipboard API，安全且高效
    navigator.clipboard.writeText(textToCopy).then(() => {
        // --- 複製成功 ---
        const originalText = copyButton.textContent;
        
        // 提供視覺回饋
        copyButton.textContent = '已複製!';
        copyButton.classList.add('copied');
        copyButton.disabled = true; // 暫時禁用按鈕避免重複點擊

        // 2 秒後恢復按鈕的原始狀態
        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.classList.remove('copied');
            copyButton.disabled = false;
        }, 2000);

    }).catch(err => {
        // --- 複製失敗 ---
        console.error('無法將文字複製到剪貼簿:', err);
        alert('複製失敗。您的瀏覽器可能不支援此功能，或未授予權限。');
    });
});
});