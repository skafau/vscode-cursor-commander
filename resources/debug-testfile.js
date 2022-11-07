/* eslint-disable */
//@ts-nocheck

import { CmpUtils } from '@combeenation/custom-js-utils';
import { CmpNames, ParamNames } from './../moltomova-cl3d-constants';
import { showLoadInfo } from './../moltomova-cl3d-loadinfo-mgr';
import { resetSceneCameraSettings } from './moltomova-3dv-camera-mgr';
import { logEvent } from '../helper/moltomova-cl3d-log-helper';
import { Color4 } from '@babylonjs/core/Maths/math.color';

/**
 * @typedef {import("@babylonjs/core/scene").Scene} Scene
 * @typedef {import("combeenation-viewer/dist/lib-cjs/api/classes/viewer").Viewer} Viewer
 */

/**
 * Adjusts some default scene settings & registers all needed cmp value change events etc.
 *
 * @param {Viewer} viewer
 */
export function initSceneMgr(viewer) {
  let scene = /** @type {Scene} */ (/** @type {unknown} */ (viewer.scene));
  let slice = 12;
  const theVar = 'some word is...';

  function inlineNormalFn1() {
    const str1 = 'some word is more than enough for all that stuff...';
    const str2 = "some word is more than enough for all that stuff...";
    const str3 = `some word is more than enough for all that stuff...`;
    const str4 = 'string literal with " inside' + "concatenated with another string";
    const str5 = 'concatenate' + str1 + str2 + 'and something else';
    const str6 = 'it\'s not that special';
    debugger;
  }

  function inlineNormalFn1() {
    const theVar = 'some word is...';
    const someObj = {
      foo: 'foo',
      bar: 'bar',
    };
    debugger;
  }

  scene.clearColor = new Color4(0, 0, 0, 0);
  const blah = 'some word is more than enough';
  scene.imageProcessingConfiguration.toneMappingEnabled = true;
  scene.imageProcessingConfiguration.toneMappingType = 1;
  scene.imageProcessingConfiguration.exposure = 1.8;

  CmpUtils.onCmpValueChanged(CmpNames.ShowScene, _onShowSceneChanged.bind(null, viewer), true);
  CmpUtils.onCmpValueChanged(CmpNames._3dParams, _on3dParamsChanged.bind(null, viewer), true);
}

/**
 * Load correct GLB file for the current variant
 *
 * @param {Viewer} viewer
 */
async function _onShowSceneChanged(viewer) {
  const sceneRec = /** @type {ShowSceneRecord} */ (CmpUtils.getRecordCmpValue(CmpNames.ShowScene));
  const sceneVariantName = sceneRec.variantName;

  const instanceLoadInfo = showLoadInfo('Model is loading ...');
  await viewer.variantInstances.show(sceneVariantName, true); // Lazy load instance if needed & show it afterwards
  viewer.variantInstances.commitParameters({}, true); // Commit current set of parameters to just activated instance
  instanceLoadInfo.hide();

  const scene = /** @type {Scene} */ (/** @type {unknown} */ (viewer.scene));
  resetSceneCameraSettings(scene);
}

/**
 * Set parameter value to show correct power adapter
 *
 * @param {Viewer} viewer
 */
async function _on3dParamsChanged(viewer) {
  logEvent('Update parameters', 'Parameter changed');
  const params = /** @type {_3dParamsRecord} */ (CmpUtils.getRecordCmpValue(CmpNames._3dParams));
  viewer.variantInstances.commitParameters(
    {
      [ParamNames.ConverterBigVisible]: params.ShowConverterBig,
      [ParamNames.ConverterSmallVisible]: params.ShowConverterSmall,
      [ParamNames.ConverterBTVisible]: params.ShowConverterBT,
      [ParamNames.ConverterBTDaliVisible]: params.ShowConverterBTDali,
      [ParamNames.LongSpotlightVisible]: params.ShowLongSpotlight,
      [ParamNames.ShowReflektorAsym]: params.ShowReflektorAsym,
      [ParamNames.ShowReflektorAsymLong]: params.ShowReflektorAsymLong,
      [ParamNames.ShowReflektorHE_B]: params.ShowReflektorHE_B,
      [ParamNames.ShowCobLinse]: params.ShowCobLinse,
      [ParamNames.ShowRingLensAcc]: params.ShowRingLensAcc,
      [ParamNames.ShowRingLensAccLong]: params.ShowRingLensAccLong,
      [ParamNames.ShowRingLensOAcc]: params.ShowRingLensOAcc,
      [ParamNames.ShowRingLensLong]: params.ShowRingLensLong,
      [ParamNames.ShowRingReflAcc]: params.ShowRingReflAcc,
      [ParamNames.ShowRingReflAccLong]: params.ShowRingReflAccLong,
      [ParamNames.ShowRingReflOAcc]: params.ShowRingReflOAcc,
      [ParamNames.ShowRingReflLong]: params.ShowRingReflLong,
      [ParamNames.ShowSafetyGlass]: params.ShowSafetyGlass,
      [ParamNames.ShowSpreadLensCOBH]: params.ShowSpreadLensCOBH,
      [ParamNames.ShowSpreadLensCOBV]: params.ShowSpreadLensCOBV,
      [ParamNames.ShowSpreadLensReflH]: params.ShowSpreadLensReflH,
      [ParamNames.ShowSpreadLensReflV]: params.ShowSpreadLensReflV,
      [ParamNames.ShowWabenrasterCOBL]: params.ShowWabenrasterCOBL,
      [ParamNames.ShowWabenrasterRefl]: params.ShowWabenrasterRefl,
      [ParamNames.ShowHousingPivot]: params.ShowHousingPivot,
      [ParamNames.ShowHousingFix]: params.ShowHousingFix,
      // Now: Find better way to handle the "MaterialColor" record type in code without using "magic indices"
      [ParamNames.MatRingColor]: params.MatRingColor[1],
      [ParamNames.MatRingMetallness]: params.MatRingColor[2],
      [ParamNames.MatRingRoughness]: params.MatRingColor[3],
      [ParamNames.MatRingLongColor]: params.MatRingLongColor[1],
      [ParamNames.MatRingLongMetallness]: params.MatRingLongColor[2],
      [ParamNames.MatRingLongRoughness]: params.MatRingLongColor[3],
      [ParamNames.MatAdapterColor]: params.MatAdapterColor[1],
      [ParamNames.MatAdapterMetallness]: params.MatAdapterColor[2],
      [ParamNames.MatAdapterRoughness]: params.MatAdapterColor[3],
      [ParamNames.MatHousingColor]: params.MatHousingColor[1],
      [ParamNames.MatHousingMetallness]: params.MatHousingColor[2],
      [ParamNames.MatHousingRoughness]: params.MatHousingColor[3],
      [ParamNames.MatRailColor]: params.MatRailColor[1],
      [ParamNames.MatRailMetallness]: params.MatRailColor[2],
      [ParamNames.MatRailRoughness]: params.MatRailColor[3],
      [ParamNames.MatReflectorColor]: params.MatReflectorColor,
    },
    true
  );
}
