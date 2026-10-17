/**
 * Redux Toolkit versi kecil di atas Nano Stores (library state yang direkomendasikan Astro).
 *
 *   createAsyncThunk  -> seperti createAsyncThunk (pending / fulfilled / rejected)
 *   createSlice       -> seperti createSlice (reducers + extraReducers)
 *   configureStore    -> seperti configureStore (dispatch, getState, select)
 */
import { atom } from "nanostores";

export interface Action<Payload = any> {
    type        : string
    payload?    : Payload
    meta?       : { arg?: any }
    error?      : { message: string }
}

type CaseReducer<State> = (state: State, action: Action) => void
type Dispatch = (action: Action | Thunk) => void
type Thunk = (dispatch: Dispatch) => Promise<void>

export function createAsyncThunk<Arg = void, Result = any>(typePrefix: string, payloadCreator: (arg: Arg) => Promise<Result>) {
    const pending   = `${typePrefix}/pending`
    const fulfilled = `${typePrefix}/fulfilled`
    const rejected  = `${typePrefix}/rejected`

    const thunk = (arg: Arg): Thunk => async (dispatch) => {
        dispatch({ type: pending, meta: { arg } })

        try {
            const payload = await payloadCreator(arg)
            dispatch({ type: fulfilled, payload, meta: { arg } })
        } catch (error) {
            dispatch({ type: rejected, error: { message: error instanceof Error ? error.message : String(error) }, meta: { arg } })
        }
    }

    return Object.assign(thunk, { pending, fulfilled, rejected })
}

interface Builder<State> {
    addCase: (type: string, handler: CaseReducer<State>) => Builder<State>
}

interface SliceOptions<State, Reducers extends Record<string, CaseReducer<State>>> {
    name            : string
    initialState    : State
    reducers        : Reducers
    extraReducers?  : (builder: Builder<State>) => void
}

export function createSlice<State, Reducers extends Record<string, CaseReducer<State>>>(options: SliceOptions<State, Reducers>) {
    const caseReducers: Record<string, CaseReducer<State>> = {}
    const actions = {} as { [Key in keyof Reducers]: (payload?: any) => Action }

    for (const reducerName of Object.keys(options.reducers) as (keyof Reducers & string)[]) {
        const type = `${options.name}/${reducerName}`
        caseReducers[type] = options.reducers[reducerName]
        actions[reducerName] = (payload?: any) => ({ type, payload })
    }

    const builder: Builder<State> = {
        addCase(type, handler) {
            caseReducers[type] = handler
            return builder
        }
    }
    options.extraReducers?.(builder)

    // Seperti immer di Redux Toolkit: reducer boleh langsung mengubah state (yang sudah disalin).
    const reducer = (state: State | undefined, action: Action): State => {
        const current = state ?? options.initialState
        const handler = caseReducers[action.type]
        if (!handler) return current

        const draft = structuredClone(current)
        handler(draft, action)
        return draft
    }

    return { name: options.name, reducer, actions }
}

type ReducerMap = Record<string, (state: any, action: Action) => any>
type StateOf<Reducers extends ReducerMap> = { [Key in keyof Reducers]: ReturnType<Reducers[Key]> }

export function configureStore<Reducers extends ReducerMap>({ reducer }: { reducer: Reducers }) {
    const reduce = (state: Partial<StateOf<Reducers>>, action: Action) => {
        const next = {} as StateOf<Reducers>
        for (const key of Object.keys(reducer) as (keyof Reducers)[]) {
            next[key] = reducer[key](state[key], action)
        }
        return next
    }

    const $state = atom<StateOf<Reducers>>(reduce({}, { type: '@@INIT' }))

    const dispatch: Dispatch = (action) => {
        if (typeof action === 'function') {
            action(dispatch)
            return
        }
        $state.set(reduce($state.get(), action))
    }

    // Seperti useAppSelector: callback dipanggil sekarang dan setiap kali hasil selector berubah.
    const select = <Selected>(selector: (state: StateOf<Reducers>) => Selected, callback: (value: Selected) => void) => {
        let lastValue: Selected | undefined
        return $state.subscribe((state) => {
            const value = selector(state)
            if (value !== lastValue) {
                lastValue = value
                callback(value)
            }
        })
    }

    return { dispatch, getState: () => $state.get(), select, $state }
}
