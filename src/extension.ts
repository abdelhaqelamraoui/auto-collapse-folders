import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
   vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
         collapseOtherFolders();
      }
   });

   vscode.workspace.onDidChangeWorkspaceFolders(() => {
      collapseOtherFolders();
   });

   vscode.workspace.onDidChangeConfiguration(() => {
      collapseOtherFolders();
   });
}

async function collapseOtherFolders() {
   const folders = vscode.workspace.workspaceFolders;
   if (!folders) {
      return;
   }

   const openFolders = await vscode.commands.executeCommand<vscode.Uri[]>(
      "vscode.executeWorkspaceSymbolProvider",
      ""
   );

   if (!openFolders) {
      return;
   }

   openFolders.forEach((folderUri) => {
      const folder = folders.find(
         (f) => f.uri.toString() === folderUri.toString()
      );
      if (folder) {
         vscode.commands.executeCommand(
            "workbench.files.action.collapseExplorerFolders"
         );
      }
   });
}

export function deactivate() {}
