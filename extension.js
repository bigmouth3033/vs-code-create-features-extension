const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */

const rfc = `import React from 'react'

export default function Index() {
  return (
    <div>Index</div>
  )
}
`;

function activate(context) {
  let disposable = vscode.commands.registerCommand("create-react-features-folder.createReactFeature", async function () {
    try {
      const folderName = await vscode.window.showInputBox({
        prompt: "Enter the name of the folder:",
        ignoreFocusOut: true,
        validateInput: (value) => {
          if (!value || value.trim() === "" || value.trim().includes(" ")) {
            return "Folder name cannot be empty, or have space";
          }
          return null;
        },
      });

      if (!folderName) {
        vscode.window.showErrorMessage("error");
        return; // User canceled input
      }

      const workspacePath = vscode.workspace.workspaceFolders; // Get the root path of the workspace
      if (!workspacePath || workspacePath.length == 0) {
        vscode.window.showErrorMessage("No workspace opened.");
        return;
      }

      const srcFolderPath = path.join(workspacePath[0].uri.fsPath, "src");
      if (!fs.existsSync(srcFolderPath)) {
        fs.mkdirSync(srcFolderPath);
        vscode.window.showInformationMessage("src folder created successfully.");
      }

      const featuresFolderPath = path.join(srcFolderPath, "features");

      if (!fs.existsSync(featuresFolderPath)) {
        fs.mkdirSync(featuresFolderPath);
        vscode.window.showInformationMessage("features folder created successfully.");
      }

      const newFeaturePath = path.join(featuresFolderPath, folderName);

      if (!fs.existsSync(newFeaturePath)) {
        fs.mkdirSync(newFeaturePath);
        fs.mkdirSync(path.join(newFeaturePath, "assets"));
        fs.mkdirSync(path.join(newFeaturePath, "components"));
        fs.mkdirSync(path.join(newFeaturePath, "api"));
        fs.mkdirSync(path.join(newFeaturePath, "utils"));
        fs.mkdirSync(path.join(newFeaturePath, "data"));
        fs.writeFileSync(`${newFeaturePath}/Index.jsx`, rfc);
        vscode.window.showInformationMessage(folderName + " features folder created successfully.");
      }
    } catch (err) {
      vscode.window.showErrorMessage(`Error: ${err.message}`);
      console.error(err);
    }
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
