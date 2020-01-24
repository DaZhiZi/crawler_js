var ref = require('ref')
var ffi = require('ffi-napi')
var Struct = require('ref-struct')
var sdl = require('./sdl')
var platform = require('os').platform()


var path = require('path')
if (platform == 'darwin') {
    var p = __dirname + '/dll/SDL2_ttf.framework/Versions/A/SDL2_ttf'
} else {
    var p = path.join(
        __dirname,
        'dll',
        'SDL2_ttf',
    )
}


// basic type
var void_type = ref.types.void
var int = ref.types.int
var string = ref.types.CString
var long = ref.types.long
var uint16 = ref.types.uint16
var SDL_Color = sdl.SDL_Color

// basic pointer
var void_ptr = ref.refType(void_type)
var string_ptr = ref.refType(string)
var int_ptr = ref.refType(int)
var SDL_Version_ptr = ref.refType(sdl.SDL_Version)
var uint16_ptr = ref.refType(uint16)
var SDL_Surface_ptr = ref.refType(sdl.SDL_Surface)
var SDL_RWops_ptr = ref.refType(sdl.SDL_RWops)
//var SDL_Texture_ptr = ref.refType(sdl.SDL_Texture)
//var SDL_Renderer_ptr = ref.refType(sdl.SDL_Renderer)
var TTF_Font_ptr = 'pointer'

// global define
var SDL_TTF_MAJOR_VERSION = 2
var SDL_TTF_MINOR_VERSION = 0
var SDL_TTF_PATCHLEVEL = 11
var SDL_TTF_VERSION = function(X) {
    X.deref().major = SDL_TTF_MAJOR_VERSION
    X.deref().minor = SDL_TTF_MINOR_VERSION
    X.deref().patch = SDL_TTF_PATCHLEVEL
};
var UNICODE_BOM_NATIVE = 0xFEFF
var UNICODE_BOM_SWAPPED = 0xFFFE

var TTF_STYLE_NORMAL = 0x00
var TTF_STYLE_BOLD = 0x01
var TTF_STYLE_ITALIC = 0x02
var TTF_STYLE_UNDERLINE = 0x04
var TTF_STYLE_STRIKETHROUGH = 0x08

var TTF_HINTING_NORMAL = 0
var TTF_HINTING_LIGHT = 1
var TTF_HINTING_MONO = 2
var TTF_HINTING_NONE = 3


var SDL_ttf = ffi.Library(p, {
    // var SDL_ttf = ffi.Library(libraryFile, {
    TTF_Linked_Version: [ SDL_Version_ptr, [] ],
    TTF_ByteSwappedUNICODE: [ void_type, [ int ] ],
    TTF_Init: [int, []],
    TTF_OpenFont: [TTF_Font_ptr, [string, int]],
    TTF_OpenFontIndex: [TTF_Font_ptr, [string, int, long]],
    TTF_OpenFontRW: [TTF_Font_ptr, [SDL_RWops_ptr, int, int]],
    TTF_OpenFontIndexRW: [TTF_Font_ptr, [SDL_RWops_ptr, int, int, long]],
    TTF_GetFontStyle: [int, [TTF_Font_ptr]],
    TTF_SetFontStyle: [void_type, [TTF_Font_ptr, int]],
    TTF_GetFontOutline: [int, [TTF_Font_ptr]],
    TTF_SetFontOutline: [void_type, [TTF_Font_ptr, int]],
    TTF_GetFontHinting: [int, [TTF_Font_ptr]],
    TTF_SetFontHinting: [void_type, [TTF_Font_ptr, int]],
    TTF_FontHeight: [int, [TTF_Font_ptr]],
    TTF_FontAscent: [int, [TTF_Font_ptr]],
    TTF_FontDescent: [int, [TTF_Font_ptr]],
    TTF_FontLineSkip: [int, [TTF_Font_ptr]],
    TTF_GetFontKerning: [int, [TTF_Font_ptr]],
    TTF_SetFontKerning: [void_type, [TTF_Font_ptr, int]],
    TTF_FontFaces: [long, [TTF_Font_ptr]],
    TTF_FontFaceIsFixedWidth: [int, [TTF_Font_ptr]],
    TTF_FontFaceFamilyName: [string, [TTF_Font_ptr]],
    TTF_FontFaceStyleName: [string, [TTF_Font_ptr]],
    TTF_GlyphIsProvided: [int, [TTF_Font_ptr, uint16]],
    TTF_GlyphMetrics: [int, [TTF_Font_ptr, uint16, int_ptr, int_ptr, int_ptr, int_ptr, int_ptr]],
    TTF_SizeText: [int, [TTF_Font_ptr, string, int_ptr, int_ptr]],
    TTF_SizeUTF8: [int, [TTF_Font_ptr, string, int_ptr, int_ptr]],
    TTF_SizeUNICODE: [int, [TTF_Font_ptr, string, int_ptr, int_ptr]],
    TTF_RenderText_Solid: [SDL_Surface_ptr, [TTF_Font_ptr, string, SDL_Color]],
    TTF_RenderUTF8_Solid: [SDL_Surface_ptr, [TTF_Font_ptr, string, SDL_Color]],
    TTF_RenderUNICODE_Solid: [SDL_Surface_ptr, [TTF_Font_ptr, uint16_ptr, SDL_Color]],
    TTF_RenderGlyph_Solid: [SDL_Surface_ptr, [TTF_Font_ptr, uint16, SDL_Color]],
    TTF_RenderText_Shaded: [SDL_Surface_ptr, [TTF_Font_ptr, string, SDL_Color, SDL_Color]],
    TTF_RenderUTF8_Shaded: [SDL_Surface_ptr, [TTF_Font_ptr, string, SDL_Color, SDL_Color]],
    TTF_RenderUNICODE_Shaded: [SDL_Surface_ptr, [TTF_Font_ptr, uint16_ptr, SDL_Color, SDL_Color]],
    TTF_RenderGlyph_Shaded: [SDL_Surface_ptr, [TTF_Font_ptr, uint16, SDL_Color, SDL_Color]],
    TTF_RenderText_Blended: [SDL_Surface_ptr, [TTF_Font_ptr, string, SDL_Color]],
    TTF_RenderUTF8_Blended: [SDL_Surface_ptr, [TTF_Font_ptr, string, SDL_Color]],
    TTF_RenderUTF8_Blended_Wrapped: [ SDL_Surface_ptr, [ TTF_Font_ptr, string, SDL_Color, int, ] ],
    TTF_RenderUNICODE_Blended: [SDL_Surface_ptr, [TTF_Font_ptr, uint16_ptr, SDL_Color]],
    TTF_RenderGlyph_Blended: [SDL_Surface_ptr, [TTF_Font_ptr, uint16, SDL_Color]],
    TTF_CloseFont: [void_type, [TTF_Font_ptr]],
    TTF_Quit: [void_type, []],
    TTF_WasInit: [int, []],
    TTF_GetFontKerningSize: [int, [TTF_Font_ptr, int, int]]
});


// export global
SDL_ttf.SDL_TTF_MAJOR_VERSION = SDL_TTF_MAJOR_VERSION
SDL_ttf.SDL_TTF_MINOR_VERSION = SDL_TTF_MINOR_VERSION
SDL_ttf.SDL_TTF_PATCHLEVEL = SDL_TTF_PATCHLEVEL
SDL_ttf.SDL_TTF_VERSION = SDL_TTF_VERSION

SDL_ttf.UNICODE_BOM_NATIVE = UNICODE_BOM_NATIVE
SDL_ttf.UNICODE_BOM_SWAPPED = UNICODE_BOM_SWAPPED

SDL_ttf.TTF_STYLE_NORMAL = TTF_STYLE_NORMAL
SDL_ttf.TTF_STYLE_BOLD = TTF_STYLE_BOLD
SDL_ttf.TTF_STYLE_ITALIC = TTF_STYLE_ITALIC
SDL_ttf.TTF_STYLE_UNDERLINE = TTF_STYLE_UNDERLINE
SDL_ttf.TTF_STYLE_STRIKETHROUGH = TTF_STYLE_STRIKETHROUGH

SDL_ttf.TTF_HINTING_NORMAL = TTF_HINTING_NORMAL
SDL_ttf.TTF_HINTING_LIGHT = TTF_HINTING_LIGHT
SDL_ttf.TTF_HINTING_MONO = TTF_HINTING_MONO
SDL_ttf.TTF_HINTING_NONE = TTF_HINTING_NONE

SDL_ttf.TTF_SetError = sdl.SDL_SetError
SDL_ttf.TTF_GetError = sdl.SDL_GetError

module.exports = SDL_ttf;
