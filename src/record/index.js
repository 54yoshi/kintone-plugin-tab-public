(function() {
  'use strict';

  const PLUGIN_ID = kintone.$PLUGIN_ID;
  const baseUrl = location.origin;
  const rawConfig = kintone.plugin.app.getConfig(PLUGIN_ID);

  if(!rawConfig)return;

  let pluginConfig;
  try{
    pluginConfig = {
      tabSettings:  JSON.parse(rawConfig.tabSettings),
      editFormData: JSON.parse(rawConfig.editFormData),
    };
  } catch (error) {
    return;
  }

  const { tabSettings } = pluginConfig;
  const { backgroundColor, fontColor, spaceField, tabs } = tabSettings;

  kintone.events.on([
    'app.record.detail.show', 
    'app.record.edit.show',
    'app.record.create.show',
  ], async function() {
    const appId = kintone.app.getId();
    const recordId = kintone.app.record.getId();

    const spaceFieldElement = kintone.app.record.getSpaceElement(tabSettings.spaceField);
    if(!spaceFieldElement){
      showBanner('タブプラグインで設定されていたスペースフィールドが見つかりません。');
      return;
    }

    //DOM要素を取得
    const rowNodes = Array.from(
      document.querySelectorAll(
        '#record-gaia .layout-gaia > .row-gaia, ' +
        '#record-gaia .layout-gaia > .subtable-row-gaia'
      )
    );

    const formLayout = await kintone.api(
      kintone.api.url('/k/v1/app/form/layout.json', true), 
      'GET', 
      {app: appId}
    )

    const targetIndex = findTargetIndex(formLayout, spaceField);
    const lowerRowNodes = rowNodes.slice(targetIndex + 1);

    const parentDiv = document.createElement('div');
    parentDiv.classList.add('parentDiv');
    parentDiv.style.borderBottom = `2px solid ${tabSettings.backgroundColor}`;

    const activeIndex = getActiveIndex(appId, recordId);
    tabs.forEach((tab, index) => {
      const tabDiv = document.createElement('div');
      tabDiv.classList.add('tab');

      parentDiv.appendChild(tabDiv);
      tabDiv.textContent = tab.tabName === '' ? `タブ${index + 1}` : tab.tabName;

      if(index === activeIndex){
        tabDiv.style.backgroundColor = backgroundColor;
        tabDiv.style.color = fontColor;
        tabDiv.style.border = `2px solid ${tabSettings.backgroundColor}`;
      }

      tabDiv.addEventListener('click', () => {
        saveActiveTab(appId, index, recordId);
        document.querySelectorAll('.tab').forEach((tabElement) => {
          tabElement.style.backgroundColor ='rgb(229, 229, 229)';
          tabElement.style.color = '#8d8d8d';
          tabElement.style.border = '2px solid #e3e2e2';
        })
        tabDiv.style.backgroundColor = backgroundColor;
        tabDiv.style.color = fontColor;
        tabDiv.style.border = `2px solid ${tabSettings.backgroundColor}`;

        lowerRowNodes.forEach((rowDom, domIndex) => {
          rowDom.style.display = 'none';
          if(tab.startRowIndex <= domIndex && domIndex < tabs[index + 1]?.startRowIndex ||
            tab.startRowIndex <= domIndex && tabs[index + 1] === undefined){
            rowDom.style.display = '';
          }
        })
      })

    })
    console.log(lowerRowNodes,'lowerRowNodes');
    console.log(tabs,'tabs');
    console.log(activeIndex,'activeIndex');

    // lowerRowNodes.forEach((row, rowIndex) => {
    //   row.style.display = 'none';
    //   if((tabs[activeIndex]?.startRowIndex <= rowIndex && 
    //     rowIndex < tabs[activeIndex + 1]?.startRowIndex) || 
    //     (tabs[activeIndex + 1] === undefined && activeIndex === 0)){
    //     row.style.display = '';
    //   }
    // });

    lowerRowNodes.forEach((row, rowIndex) => {
      row.style.display = 'none';
      
      const currentTab = tabs[activeIndex];
      if (!currentTab) return;
      
      const isInCurrentTabRange = 
        rowIndex >= currentTab.startRowIndex && 
        (tabs[activeIndex + 1] ? rowIndex < tabs[activeIndex + 1].startRowIndex : true);
      
      if (isInCurrentTabRange) {
        row.style.display = '';
      }
    });

    spaceFieldElement.appendChild(parentDiv);

    function showBanner(message) {
      // バナー要素を作成
      const banner = document.createElement('div');
      banner.className = 'custom-alert-banner';
      // 設定画面へのリンク URL
      const pluginUrl = 
      baseUrl +
      `/k/admin/app/${appId}/plugin/`+
      `config?pluginId=${PLUGIN_ID}`;
      // バナーの中身をセット
      banner.innerHTML = message +
      '<a href="' + pluginUrl + '"" ' +
        'style="margin-left:8px;color:#fff;text-decoration:underline;">' +
        '設定画面を開く' +
      '</a>';
      
      // レコード画面のヘッダースペースに差し込む
      const headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
      if (headerSpace) {
        headerSpace.appendChild(banner);
      } else {
        document.body.appendChild(banner);
      }
      // アニメーション用クラスを遅延追加
      setTimeout(() => {
        banner.classList.add('show');
      }, 20);
    }
    return;
  });

  kintone.events.on([
    'mobile.app.record.detail.show', 
    'mobile.app.record.edit.show',
    'mobile.app.record.create.show',
  ], async function() {
    const appId = kintone.mobile.app.getId();
    const recordId = kintone.mobile.app.record.getId();
    
    const spaceFieldMobile = kintone.mobile.app.record.getSpaceElement(spaceField);

    if(!spaceFieldMobile){
      return;
    }

    const formLayout = await kintone.api(
      kintone.api.url('/k/v1/app/form/layout.json', true),
      'GET',
      { app: appId }
    );

    console.log(formLayout,'formLayout');
    
    const rowNodes = Array.from(
      document.querySelectorAll(
        '.layout-gaia > *'
      )
    );  
    const targetIndex = findTargetIndex(formLayout, spaceField);
    const lowerRowNodes = rowNodes.slice(targetIndex + 1);

    const activeIndex = getActiveIndex(appId, recordId);

    const parentDiv = document.createElement('div');
    parentDiv.classList.add('mobile-parentDiv');
    parentDiv.style.borderBottom = `2px solid ${tabSettings.backgroundColor}`;

    tabs.forEach((tab, index) => {
      const tabDiv = document.createElement('div');
      tabDiv.classList.add('tab');

      parentDiv.appendChild(tabDiv);
      tabDiv.textContent = tab.tabName === '' ? `タブ${index + 1}` : tab.tabName;

      if(index === activeIndex){
        tabDiv.style.backgroundColor = backgroundColor;
        tabDiv.style.color = fontColor;
        tabDiv.style.border = `2px solid ${tabSettings.backgroundColor}`;
      }

      tabDiv.addEventListener('click', () => {
        saveActiveTab(appId, index, recordId);
        document.querySelectorAll('.tab').forEach((tabElement) => {
          tabElement.style.backgroundColor ='rgb(229, 229, 229)';
          tabElement.style.color = '#8d8d8d';
          tabElement.style.border = '2px solid #e3e2e2';
        })
        tabDiv.style.backgroundColor = backgroundColor;
        tabDiv.style.color = fontColor;
        tabDiv.style.border = `2px solid ${tabSettings.backgroundColor}`;

        lowerRowNodes.forEach((rowDom, domIndex) => {
          rowDom.style.display = 'none';
          if(tab.startRowIndex <= domIndex && domIndex < tabs[index + 1]?.startRowIndex ||
            tab.startRowIndex <= domIndex && tabs[index + 1] === undefined){
            rowDom.style.display = '';
          }
        })
      })
    })

    // lowerRowNodes.forEach((row, rowIndex) => {
    //   row.style.display = 'none';
    //   if((tabs[activeIndex]?.startRowIndex <= rowIndex && 
    //     rowIndex < tabs[activeIndex + 1]?.startRowIndex)|| 
    //     (tabs[activeIndex + 1] === undefined && activeIndex === 0)){
    //     row.style.display = '';
    //   }
    // });

    lowerRowNodes.forEach((row, rowIndex) => {
      row.style.display = 'none';

      const currentTab = tabs[activeIndex];
      if(!currentTab) return;

      const isInCurrentTabRange = 
        rowIndex >= currentTab.startRowIndex && 
        (tabs[activeIndex + 1] ? rowIndex < tabs[activeIndex + 1].startRowIndex : true);

      if(isInCurrentTabRange) row.style.display = '';
    });
    spaceFieldMobile.appendChild(parentDiv);
  });

  function findTargetIndex(formLayout, spaceField){
    let targetIndex = 0;
    for (let i = 0; i < formLayout.layout.length; i++) {
      const item = formLayout.layout[i];
      switch(item.type){
        case 'GROUP':
          for (let j = 0; j < item.layout.length; j++) {
            const row = item.layout[j];
            for (let k = 0; k < row.fields.length; k++) {
              const field = row.fields[k];
              if(field?.elementId === spaceField) {
                targetIndex = i;
                break;
              }
            }
          }
          break;
        default:
          for(let k = 0; k < item.fields.length; k++) {
            const field = item.fields[k];
            if(field?.elementId === spaceField) {
              targetIndex = i;
              break;
            }
          }
      }
    }
    return targetIndex;
  }

  // SessionStorageのキー（アプリIDとレコードIDを含む）
  const getStorageKey = (appId) => {
    return `tabPlugin_${PLUGIN_ID}`;
  };

  // アクティブなタブインデックスを保存
  const saveActiveTab = (appId, tabIndex, recordId) => {
    console.log('appId',appId);
    const key = getStorageKey(appId);
    const saveItem = {
      activeIndex: tabIndex,
      recordId: recordId,
      appId: appId,
    }
    sessionStorage.setItem(key, JSON.stringify(saveItem));
  };

  // 保存されたアクティブなタブインデックスを取得
  const getActiveIndex = (appId, recordId) => {
    const key = getStorageKey(appId);
    const saved = JSON.parse(sessionStorage.getItem(key));

    if(!saved || recordId !== saved.recordId || appId !== saved.appId){
      return 0;
    }

    return saved.activeIndex; 
  };
})();
