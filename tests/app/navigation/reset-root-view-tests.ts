﻿import * as TKUnit from "../TKUnit";
import { Page } from "tns-core-modules/ui/page";
import { Frame, NavigationEntry, stack } from "tns-core-modules/ui/frame";
import { _resetRootView, getRootView } from "tns-core-modules/application";
import { TabView, TabViewItem } from "tns-core-modules/ui/tab-view";

function createTestFrameRootEntry() {
    const page = new Page();
    const frameRoot = new Frame();
    frameRoot.navigate(() => page);

    const entry: NavigationEntry = {
        create: () => frameRoot
    };

    return {
        entry: entry,
        root: frameRoot,
        page: page
    };
}

function createTestTabRootEntry() {
    const testFrameRoot1 = createTestFrameRootEntry();
    const testFrameRoot2 = createTestFrameRootEntry();

    const tabView = new TabView();
    const tabEntry1 = new TabViewItem();
    tabEntry1.title = "frameRoot1";
    tabEntry1.view = testFrameRoot1.root;
    const tabEntry2 = new TabViewItem();
    tabEntry2.title = "frameRoot2";
    tabEntry2.view = testFrameRoot2.root;
    tabView.items = [tabEntry1, tabEntry2];

    const entry: NavigationEntry = {
        create: () => tabView
    };

    return {
        entry: entry,
        root: tabView,
        page: testFrameRoot1.page
    };
}

export function test_reset_frame_to_frame() {
    const testFrameRoot1 = createTestFrameRootEntry();

    _resetRootView(testFrameRoot1.entry);
    TKUnit.waitUntilReady(() => testFrameRoot1.page.isLoaded);

    const rootView1 = getRootView();
    const frameStack1 = stack();
    TKUnit.assertEqual(rootView1, testFrameRoot1.root);
    TKUnit.assertEqual(frameStack1.length, 1);

    const testFrameRoot2 = createTestFrameRootEntry();

    _resetRootView(testFrameRoot2.entry);
    TKUnit.waitUntilReady(() => testFrameRoot2.page.isLoaded);

    const rootView2 = getRootView();
    const frameStack2 = stack();
    TKUnit.assertEqual(rootView2, testFrameRoot2.root);
    TKUnit.assertEqual(frameStack2.length, 1);
};

export function test_reset_frame_to_tab() {
    const testFrameRoot = createTestFrameRootEntry();

    _resetRootView(testFrameRoot.entry);
    TKUnit.waitUntilReady(() => testFrameRoot.page.isLoaded);

    const rootView1 = getRootView();
    const frameStack1 = stack();
    TKUnit.assertEqual(rootView1, testFrameRoot.root);
    TKUnit.assertEqual(frameStack1.length, 1);

    const testTabRoot = createTestTabRootEntry();

    _resetRootView(testTabRoot.entry);
    TKUnit.waitUntilReady(() => testTabRoot.page.isLoaded);

    const rootView2 = getRootView();
    const frameStack2 = stack();
    TKUnit.assertEqual(rootView2, testTabRoot.root);
    TKUnit.assertEqual(frameStack2.length, 2);
};

export function test_reset_tab_to_frame() {
    const testTabRoot = createTestTabRootEntry();

    _resetRootView(testTabRoot.entry);
    TKUnit.waitUntilReady(() => testTabRoot.page.isLoaded);

    const rootView2 = getRootView();
    const frameStack2 = stack();
    TKUnit.assertEqual(rootView2, testTabRoot.root);
    TKUnit.assertEqual(frameStack2.length, 2);

    const testFrameRoot = createTestFrameRootEntry();

    _resetRootView(testFrameRoot.entry);
    TKUnit.waitUntilReady(() => testFrameRoot.page.isLoaded);

    const rootView1 = getRootView();
    const frameStack1 = stack();
    TKUnit.assertEqual(rootView1, testFrameRoot.root);
    TKUnit.assertEqual(frameStack1.length, 1);
};

export function test_reset_tab_to_tab() {
    const testTabRoot1 = createTestTabRootEntry();

    _resetRootView(testTabRoot1.entry);
    TKUnit.waitUntilReady(() => testTabRoot1.page.isLoaded);

    const rootView1 = getRootView();
    const frameStack1 = stack();
    TKUnit.assertEqual(rootView1, testTabRoot1.root);
    TKUnit.assertEqual(frameStack1.length, 2);

    const testTabRoot2 = createTestTabRootEntry();

    _resetRootView(testTabRoot2.entry);
    TKUnit.waitUntilReady(() => testTabRoot2.page.isLoaded);

    const rootView2 = getRootView();
    const frameStack2 = stack();
    TKUnit.assertEqual(rootView2, testTabRoot2.root);
    TKUnit.assertEqual(frameStack2.length, 2);
};

export function tearDownModule() {
    // reset the root to frame for other tests
    const resetFrameRoot = createTestFrameRootEntry();

    _resetRootView(resetFrameRoot.entry);
    TKUnit.waitUntilReady(() => resetFrameRoot.page.isLoaded);
}