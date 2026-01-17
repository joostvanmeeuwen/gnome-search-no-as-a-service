import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

import { NaasSearchProvider } from './searchProvider.js';

export default class NaasSearchExtension extends Extension {
    enable() {
        console.log('NaaS GNOME Search enabled');

        this._searchProvider = new NaasSearchProvider(this);
        Main.overview.searchController.addProvider(this._searchProvider);

        console.log('NaaS Search Provider registered');
    }

    disable() {
        console.log('NaaS GNOME Search disabled');

        if (this._searchProvider) {
            Main.overview.searchController.removeProvider(this._searchProvider);
            this._searchProvider = null;
        }

        console.log('NaaS Search Provider unregistered');
    }
}