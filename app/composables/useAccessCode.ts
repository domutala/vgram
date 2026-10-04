const KEY = 'access-code';
const _code = ref('');

export function useAccessCode() {
  const code = computed({
    get() {
      return _code.value;
    },
    set(v) {
      _code.value = v.trim();
      localStorage.setItem(KEY, _code.value);
    },
  });

  onMounted(() => {
    code.value = localStorage.getItem(KEY) ?? '';
  });

  return {
    code,
    hasCode: computed(() => !!code.value),
    set(value: string) {
      code.value = value.trim();
      localStorage.setItem(KEY, code.value);
    },
    clear() {
      code.value = '';
      localStorage.removeItem(KEY);
    },
  };
}
