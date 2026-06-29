// types.js — JSDoc typedefs for the data layer (vanilla, so types live in comments).
// These shapes back the DriftCast catalog and the Phase-5 configurator.
//
// IMPORTANT honesty note: power/weight figures in the catalogs are REPRESENTATIVE
// estimates for display + configurator math (drift builds vary enormously). Source
// notes mostly quote hp/whp; kW values here are rounded conversions for computation.
// Confirm against a real build before treating any number as gospel.

/**
 * @typedef {Object} Engine
 * @property {string} id            kebab-case id
 * @property {string} name
 * @property {string} family
 * @property {number} [displacementL]
 * @property {number} [weightKg]
 * @property {number} [stockPowerKw]
 * @property {number} [builtPowerKw]
 * @property {('I4'|'I6'|'V6'|'V8'|'rotary')} layout
 * @property {('short'|'long')} lengthClass   packaging length in the bay
 * @property {number} valueRating   1–5 (AU value/availability)
 * @property {string} [sourceCostNote]
 * @property {string} [fitNotes]
 * @property {string[]} tags
 */

/**
 * @typedef {Object} Gearbox
 * @property {string} id
 * @property {string} name
 * @property {('manual'|'auto'|'sequential')} type
 * @property {number} [speeds]
 * @property {number} [torqueRatingNm]
 * @property {number} [powerProvenKw]
 * @property {string} [costNote]
 * @property {string} [fitNotes]
 * @property {string[]} tags
 */

/**
 * @typedef {Object} Diff
 * @property {string} id
 * @property {string} name
 * @property {string[]} lsdTypes      e.g. ['2-way','1.5-way','spool']
 * @property {string} [strengthNote]
 * @property {string} [costNote]
 * @property {string[]} tags
 */

/**
 * @typedef {Object} Suspension
 * @property {string} id
 * @property {string} name
 * @property {string} [vendor]
 * @property {string} type
 * @property {string} [travelNote]
 * @property {string} [costNote]
 * @property {string[]} [tags]
 */

/**
 * @typedef {Object} Wheel
 * @property {string} id
 * @property {number} [diameterIn]
 * @property {number} widthIn
 * @property {number} [offsetMm]
 * @property {string} [tyreWidthMm]
 * @property {string} [fitNotes]
 */

/**
 * @typedef {Object} BuildConfig   (URL-encoded in the configurator)
 * @property {string} engineId
 * @property {string} gearboxId
 * @property {string} diffId
 * @property {string} suspensionId
 * @property {string} wheelId
 * @property {string} skinId
 */

/**
 * @typedef {Object} DerivedMetrics
 * @property {number} estWeightKg
 * @property {number} rearBiasPct
 * @property {number} powerToWeight   kW per tonne
 * @property {boolean} packagingOk
 * @property {string[]} warnings
 */

/**
 * @typedef {Object} ChassisNode  @property {string} id @property {number} x @property {number} y @property {number} z
 * @typedef {Object} PartSlot     @property {string} id @property {string} label @property {{x:number,y:number,z:number}} pos @property {string} [model]
 * @typedef {Object} ChassisSpec
 * @property {string} vertical
 * @property {number} overallLengthMm
 * @property {number} wheelbaseMm
 * @property {number} frontTrackMm
 * @property {number} rearTrackMm
 * @property {number} [cageWidthMm]
 * @property {number} [cageHeightMm]
 * @property {number} tyreDiameterIn
 * @property {ChassisNode[]} nodes
 * @property {Array<[string,string]>} edges
 * @property {PartSlot[]} partSlots
 */

export const SCHEMA_VERSION = '0.1';
