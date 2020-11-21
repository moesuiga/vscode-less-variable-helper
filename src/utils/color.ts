/**
 * rgb 数字 0 - 255
 * @constant
 */
const RGB_NUMBER = '([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])';

/**
 * alpha 0 - 1
 * @constant
 */
const ALPHA_NUMBER = '(0(\\.\\d+)?|\\.\\d+|1(\\.0+)?)';

/**
 * 角度 0 - 360
 * @constant
 */
const ANGLE = '([0-9]|[1-9][0-9]|[12][0-9]{2}|3[0-5][0-9]|360)';

/**
 * 灰度、亮度 0 - 100 %
 * @constant
 */
const PERCENT = '([0-9]|[1-9][0-9]|100)%';

const rgbNumberSpace = `\\s*${RGB_NUMBER}\\s*`;
const alphaNumberSpace = `\\s*${ALPHA_NUMBER}\\s*`;
const angleSpace = `\\s*${ANGLE}\\s*`;
const percentSpace = `\\s*${PERCENT}\\s*`;

/**
 * 十六进制颜色值
 * @constant
 */
export const REG_HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/**
 * rgb颜色值
 * @constant
 */
export const REG_RGB_COLOR = new RegExp(`^rgb\\s*\\(${rgbNumberSpace},${rgbNumberSpace},${rgbNumberSpace}\\)$`, 'i');

/**
 * rgba颜色值
 * @constant
 */
export const REG_RGBA_COLOR = new RegExp(`^rgba\\s*\\(${`${rgbNumberSpace},`.repeat(3)}${alphaNumberSpace}\\)$`, 'i');

/**
 * hsl颜色值
 * @constant
 */
export const REG_HSL_COLOR = new RegExp(`^hsl\\s*\\(${angleSpace},${angleSpace},${angleSpace}\\)$`, 'i');

/**
 * hsla颜色值
 * @constant
 */
export const REG_HSLA_COLOR = new RegExp(`^hsl\\s*\\(${`${angleSpace},`.repeat(3)}${alphaNumberSpace}\\)$`, 'i');

/**
 * 是否是颜色值
 * @param color
 */
export function isColor(color: string) {
  return REG_HEX_COLOR.test(color)
    || REG_RGB_COLOR.test(color)
    || REG_RGBA_COLOR.test(color)
    || REG_HSL_COLOR.test(color)
    || REG_HSLA_COLOR.test(color);
}
