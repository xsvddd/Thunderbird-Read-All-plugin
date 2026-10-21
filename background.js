// Tworzenie pozycji w menu kontekstowym folderu
messenger.menus.create({
  id: "mark-folder-read",
  title: "Oznacz wszystkie jako przeczytane",
  contexts: ["folder_pane"]
});

// Obsługa kliknięcia w menu
messenger.menus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "mark-folder-read" && info.selectedFolders && info.selectedFolders.length > 0) {
    for (const folder of info.selectedFolders) {
      await markFolderAsRead(folder);
    }
  }
});

// Funkcja przechodząca przez wiadomości w folderze
async function markFolderAsRead(folder) {
  try {
    // Pobieranie nieprzeczytanych wiadomości z folderu
    let page = await messenger.messages.list(folder);
    
    for (let message of page.messages) {
      if (!message.read) {
        await messenger.messages.update(message.id, { read: true });
      }
    }

    // Pętla pobierająca kolejne strony wiadomości, jeśli jest ich więcej
    while (page.id) {
      page = await messenger.messages.continueList(page.id);
      for (let message of page.messages) {
        if (!message.read) {
          await messenger.messages.update(message.id, { read: true });
        }
      }
    }
  } catch (error) {
    console.error("[READ-ALL-ADDON] Error while marking message as read: ", error);
  }
}
