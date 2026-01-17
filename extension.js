import GLib from 'gi://GLib';

export default class NaasSearchExtension {
    enable() {
        console.log('NaaS GNOME Search enabled');
    }

    disable() {
        console.log('NaaS GNOME Search disabled');
    }
}