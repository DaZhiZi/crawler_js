var ref = require('ref')
var ffi = require('ffi-napi')
var Struct = require('ref-struct')
var sdl = require('./sdl')
const os = require('os')
const path = require('path')


if (os.platform() === 'darwin') {
    var p = __dirname + '/dll/mixerx.dylib'
} else {
    var p = path.join(
        __dirname,
        'dll',
        'SDL2_mixer_ext',
    )
}


// basic type
var void_type = ref.types.void
var int = ref.types.int
var string = ref.types.CString
var Uint8 = ref.types.uint8
var Uint16 = ref.types.uint16
var Uint32 = ref.types.uint32
var Sint16 = ref.types.short
var double = ref.types.double

// basic pointer
var void_ptr = ref.refType(void_type)
var int_ptr = ref.refType(int)
var SDL_Version_ptr = ref.refType(sdl.SDL_Version)
var string_ptr = ref.refType(string)
var Uint8_ptr = ref.refType(Uint8)
var Uint16_ptr = ref.refType(Uint16)
var SDL_RWops_ptr = ref.refType(sdl.SDL_RWops)

// global define
var MIX_MAJOR_VERSION = 2
var MIX_MINOR_VERSION = 0
var MIX_PATCHLEVEL = 1
var MIX_VERSION = function(X) {
    X.deref().major = MIX_MAJOR_VERSION
    X.deref().minor = MIX_MINOR_VERSION
    X.deref().patch = MIX_PATCHLEVEL
}
var MIX_InitFlags = {
    MIX_INIT_FLAC: 0x00000001,
    MIX_INIT_MOD: 0x00000002,
    MIX_INIT_MODPLUG: 0x00000004,
    MIX_INIT_MP3: 0x00000008,
    MIX_INIT_OGG: 0x00000010,
    MIX_INIT_FLUIDSYNTH: 0x00000020
}
var MIX_CHANNELS = 8
var MIX_DEFAULT_FREQUENCY = 22050
var MIX_DEFAULT_FORMAT = (sdl.SDL_BYTEORDER == sdl.SD_LIL_ENDIAN) ? 0x8010 : 0x9010
var MIX_DEFAULT_CHANNELS = 2
var MIN_MAX_VOLUME = 128

var Mix_Chunk = Struct({
    allocated: int,
    abuf: Uint8_ptr,
    alen: Uint32,
    volume: Uint8
})
var Mix_Chunk_ptr = ref.refType(Mix_Chunk)

var Mix_Fading = {
    MIX_NO_FADING: 0,
    MIX_FADING_OUT: 1,
    MIX_FADING_IN: 2
}
var Mix_Fading_type = int

var Mix_MusicType = {
    MUS_NONE: 0,
    MUS_CMD: 1,
    MUS_WAV: 2,
    MUS_MOD: 3,
    MUS_MID: 4,
    MUS_OGG: 5,
    MUS_MP3: 6,
    MUS_MP3_MAD: 7,
    MUS_FLAC: 8,
    MUS_MODPLUG: 9
}
var Mix_MusicType_type = int
var Mix_Music_ptr = 'pointer'
var MIX_CHANNEL_POST = -2
var MIX_EFFECTSMAXSPEED = 'MIX_EFFECTSMAXSPEED'


var SDL_mixer = ffi.Library(p, {
    Mix_Linked_Version: [SDL_Version_ptr, []],
    Mix_Init: [int, [int]],
    Mix_Quit: [void_type, []],
    Mix_OpenAudio: [int, [int, Uint16, int, int]],
    //Mix_OpenAudioDevice: [int, [int, Uint16, int, int, string, int]],
    Mix_AllocateChannels: [int, [int]],
    Mix_QuerySpec: [int, [int_ptr, Uint16_ptr, int_ptr]],
    Mix_LoadWAV_RW: [Mix_Chunk_ptr, [SDL_RWops_ptr, int]],
    Mix_LoadMUS: [Mix_Music_ptr, [string]],
    Mix_LoadMUS_RW: [Mix_Music_ptr, [SDL_RWops_ptr, int]],
    Mix_LoadMUSType_RW: [Mix_Music_ptr, [SDL_RWops_ptr, Mix_MusicType_type, int]],
    Mix_QuickLoad_WAV: [Mix_Chunk_ptr, [Uint8_ptr]],
    Mix_QuickLoad_RAW: [Mix_Chunk_ptr, [Uint8_ptr, Uint32]],
    Mix_FreeChunk: [void_type, [Mix_Chunk_ptr]],
    Mix_FreeMusic: [void_type, [Mix_Music_ptr]],
    Mix_GetNumChunkDecoders: [int, []],
    Mix_GetChunkDecoder: [string, [int]],
    Mix_GetNumMusicDecoders: [int, []],
    Mix_GetMusicDecoder: [string, [int]],
    Mix_GetMusicType: [Mix_MusicType_type, [Mix_Music_ptr]],
    //extern DECLSPEC void SDLCALL Mix_SetPostMix(void (*mix_func)(void *udata, Uint8 *stream, int len), void *arg);
    //extern DECLSPEC void SDLCALL Mix_HookMusic(void (*mix_func)(void *udata, Uint8 *stream, int len), void *arg);
    //extern DECLSPEC void SDLCALL Mix_HookMusicFinished(void (*music_finished)(void));
    Mix_GetMusicHookData: [void_ptr, []],
    //extern DECLSPEC void SDLCALL Mix_ChannelFinished(void (*channel_finished)(int channel));
    //typedef void (*Mix_EffectFunc_t)(int chan, void *stream, int len, void *udata);
    //typedef void (*Mix_EffectDone_t)(int chan, void *udata);
    //extern DECLSPEC int SDLCALL Mix_RegisterEffect(int chan, Mix_EffectFunc_t f, Mix_EffectDone_t d, void *arg);
    //extern DECLSPEC int SDLCALL Mix_UnregisterEffect(int channel, Mix_EffectFunc_t f);
    Mix_UnregisterAllEffects: [int, [int]],
    Mix_SetPanning: [int, [int, Uint8, Uint8]],
    Mix_SetPosition: [int, [int, Sint16, Uint8]],
    // double Mix_GetMusicPosition(Mix_Music *music)
    // double Mix_GetMusicTotalTime(Mix_Music *music)
    Mix_GetMusicPosition: [double, [Mix_Music_ptr]],
    Mix_GetMusicTotalTime: [double, [Mix_Music_ptr]],


    Mix_SetDistance: [int, [int, Uint8]],
    Mix_SetReverseStereo: [int, [int, int]],
    Mix_ReserveChannels: [int, [int]],
    Mix_GroupChannel: [int, [int, int]],
    Mix_GroupChannels: [int, [int, int, int]],
    Mix_GroupAvailable: [int, [int]],
    Mix_GroupCount: [int, [int]],
    Mix_GroupOldest: [int, [int]],
    Mix_GroupNewer: [int, [int]],
    Mix_PlayChannelTimed: [int, [int, Mix_Chunk_ptr, int, int]],
    Mix_PlayMusic: [int, [Mix_Music_ptr, int]],
    Mix_FadeInMusic: [int, [Mix_Music_ptr, int, int]],
    Mix_FadeInMusicPos: [int, [Mix_Music_ptr, int, int, double]],
    Mix_FadeInChannelTimed: [int, [int, Mix_Chunk_ptr, int, int, int]],
    Mix_Volume: [int, [int]],
    Mix_VolumeChunk: [int, [Mix_Chunk_ptr, int]],
    Mix_VolumeMusic: [int, [int]],
    Mix_HaltChannel: [int, [int]],
    Mix_HaltGroup: [int, [int]],
    Mix_HaltMusic: [int, []],
    Mix_ExpireChannel: [int, [int, int]],
    Mix_FadeOutChannel: [int, [int, int]],
    Mix_FadeOutGroup: [int, [int, int]],
    Mix_FadeOutMusic: [int, [int]],
    Mix_FadingMusic: [Mix_Fading_type, []],
    Mix_FadingChannel: [Mix_Fading_type, [int]],
    Mix_Pause: [void_type, [int]],
    Mix_Resume: [void_type, [int]],
    Mix_Paused: [int, [int]],
    Mix_PauseMusic: [void_type, []],
    Mix_ResumeMusic: [void_type, []],
    Mix_RewindMusic: [void_type, []],
    Mix_PausedMusic: [int, []],
    Mix_SetMusicPosition: [int, [double]],
    Mix_Playing: [int, [int]],
    Mix_PlayingMusic: [int, []],
    Mix_SetMusicCMD: [int, [string]],
    Mix_SetSynchroValue: [int, [int]],
    Mix_GetSynchroValue: [int, []],
    Mix_SetSoundFonts: [int, [string]],
    Mix_GetSoundFonts: [string, []],
    //extern DECLSPEC int SDLCALL Mix_EachSoundFont(int (*function)(const char*, void*), void *data);
    Mix_GetChunk: [Mix_Chunk_ptr, [int]],
    Mix_CloseAudio: [void_type, []]
});

var Mix_LoadWAV = function(file) {
    return SDL_mixer.Mix_LoadWAV_RW(sdl.SDL_RWFromFile(file, "rb"), 1)
}
var Mix_PlayChannel = function(channel, chunk, loops) {
    return SDL_mixer.Mix_PlayChannelTimed(channel, chunk, loops, -1)
}
var Mix_FadeInChannel = function(channel, chunk, loops, ms) {
    return SDL_mixer.Mix_FadeInChannelTimed(channel,chunk,loops,ms,-1)
}

// export global
SDL_mixer.MIX_MAJOR_VERSION = MIX_MAJOR_VERSION
SDL_mixer.MIX_MINOR_VERSION = MIX_MINOR_VERSION
SDL_mixer.MIX_PATCHLEVEL = MIX_PATCHLEVEL
SDL_mixer.MIX_VERSION = MIX_VERSION
SDL_mixer.MIX_InitFlags = MIX_InitFlags
SDL_mixer.Mix_SetError = sdl.SDL_SetError
SDL_mixer.Mix_GetError = sdl.SDL_GetError
SDL_mixer.MIX_CHANNELS = MIX_CHANNELS
SDL_mixer.MIX_DEFAULT_FREQUENCY = MIX_DEFAULT_FREQUENCY
SDL_mixer.MIX_DEFAULT_FORMAT = MIX_DEFAULT_FORMAT
SDL_mixer.MIX_DEFAULT_CHANNELS = MIX_DEFAULT_CHANNELS
SDL_mixer.MIN_MAX_VOLUME = MIN_MAX_VOLUME
SDL_mixer.Mix_Chunk = Mix_Chunk
SDL_mixer.Mix_Chunk_ptr = Mix_Chunk_ptr
SDL_mixer.Mix_Fading = Mix_Fading
SDL_mixer.Mix_MusicType = Mix_MusicType
SDL_mixer.Mix_Music_ptr = Mix_Music_ptr
SDL_mixer.MIX_CHANNEL_POST = MIX_CHANNEL_POST
SDL_mixer.MIX_EFFECTSMAXSPEED = MIX_EFFECTSMAXSPEED
SDL_mixer.Mix_LoadWAV = Mix_LoadWAV
SDL_mixer.Mix_PlayChannel = Mix_PlayChannel
SDL_mixer.Mix_FadeInChannel = Mix_FadeInChannel

module.exports = SDL_mixer;
