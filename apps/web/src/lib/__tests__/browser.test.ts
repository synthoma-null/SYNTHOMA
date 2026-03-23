import { 
  isBrowser, 
  readStorage, 
  writeStorage, 
  readBooleanStorage, 
  readNumberStorage,
  readStorageJSON,
  writeStorageJSON,
  removeStorage
} from '../browser'

// Mock localStorage and sessionStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Setup mocks
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  })
  Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage,
    writable: true,
  })
  
  // Clear all mocks
  jest.clearAllMocks()
})

describe('browser utilities', () => {
  describe('isBrowser', () => {
    it('should return true in browser environment', () => {
      expect(isBrowser()).toBe(true)
    })
  })

  describe('readStorage', () => {
    it('should read from localStorage by default', () => {
      mockLocalStorage.getItem.mockReturnValue('test-value')
      
      const result = readStorage('test-key')
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key')
      expect(result).toBe('test-value')
    })

    it('should read from sessionStorage when specified', () => {
      mockSessionStorage.getItem.mockReturnValue('session-value')
      
      const result = readStorage('test-key', null, 'session')
      
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('test-key')
      expect(result).toBe('session-value')
    })

    it('should return fallback when storage is null', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      const result = readStorage('test-key', 'fallback')
      
      expect(result).toBe('fallback')
    })

    it('should return fallback when storage throws error', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      const result = readStorage('test-key', 'fallback')
      
      expect(result).toBe('fallback')
    })

    it('should return null fallback when not specified', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      const result = readStorage('test-key')
      
      expect(result).toBeNull()
    })
  })

  describe('writeStorage', () => {
    it('should write to localStorage by default', () => {
      mockLocalStorage.setItem.mockReturnValue(undefined)
      
      const result = writeStorage('test-key', 'test-value')
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value')
      expect(result).toBe(true)
    })

    it('should write to sessionStorage when specified', () => {
      mockSessionStorage.setItem.mockReturnValue(undefined)
      
      const result = writeStorage('test-key', 'test-value', 'session')
      
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value')
      expect(result).toBe(true)
    })

    it('should return false when storage is null', () => {
      Object.defineProperty(window, 'localStorage', {
        value: null,
        writable: true,
      })
      
      const result = writeStorage('test-key', 'test-value')
      
      expect(result).toBe(false)
    })

    it('should return false when storage throws error', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      const result = writeStorage('test-key', 'test-value')
      
      expect(result).toBe(false)
    })
  })

  describe('readBooleanStorage', () => {
    it('should return true for "1"', () => {
      mockLocalStorage.getItem.mockReturnValue('1')
      
      const result = readBooleanStorage('test-key')
      
      expect(result).toBe(true)
    })

    it('should return true for "true"', () => {
      mockLocalStorage.getItem.mockReturnValue('true')
      
      const result = readBooleanStorage('test-key')
      
      expect(result).toBe(true)
    })

    it('should return false for "0"', () => {
      mockLocalStorage.getItem.mockReturnValue('0')
      
      const result = readBooleanStorage('test-key')
      
      expect(result).toBe(false)
    })

    it('should return false for "false"', () => {
      mockLocalStorage.getItem.mockReturnValue('false')
      
      const result = readBooleanStorage('test-key')
      
      expect(result).toBe(false)
    })

    it('should return fallback for other values', () => {
      mockLocalStorage.getItem.mockReturnValue('maybe')
      
      const result = readBooleanStorage('test-key', false)
      
      expect(result).toBe(false)
    })
  })

  describe('readNumberStorage', () => {
    it('should return number for valid string', () => {
      mockLocalStorage.getItem.mockReturnValue('42')
      
      const result = readNumberStorage('test-key', 0)
      
      expect(result).toBe(42)
    })

    it('should return fallback for invalid string', () => {
      mockLocalStorage.getItem.mockReturnValue('not-a-number')
      
      const result = readNumberStorage('test-key', 10)
      
      expect(result).toBe(10)
    })

    it('should return fallback for null', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      const result = readNumberStorage('test-key', 10)
      
      expect(result).toBe(10)
    })
  })

  describe('readStorageJSON', () => {
    it('should parse valid JSON', () => {
      const testData = { name: 'test', value: 123 }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testData))
      
      const result = readStorageJSON('test-key', testData)
      
      expect(result).toEqual(testData)
    })

    it('should return fallback for invalid JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json')
      
      const result = readStorageJSON('test-key', { default: true })
      
      expect(result).toEqual({ default: true })
    })

    it('should return fallback for null', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      const result = readStorageJSON('test-key', { default: true })
      
      expect(result).toEqual({ default: true })
    })
  })

  describe('writeStorageJSON', () => {
    it('should stringify and write object', () => {
      const testData = { name: 'test', value: 123 }
      mockLocalStorage.setItem.mockReturnValue(undefined)
      
      writeStorageJSON('test-key', testData)
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testData))
    })

    it('should write to both storages', () => {
      const testData = { name: 'test' }
      mockLocalStorage.setItem.mockReturnValue(undefined)
      mockSessionStorage.setItem.mockReturnValue(undefined)
      
      writeStorageJSON('test-key', testData, 'local')
      writeStorageJSON('test-key', testData, 'session')
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testData))
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testData))
    })
  })

  describe('removeStorage', () => {
    it('should remove from localStorage by default', () => {
      mockLocalStorage.removeItem.mockReturnValue(undefined)
      
      const result = removeStorage('test-key')
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key')
      expect(result).toBe(true)
    })

    it('should remove from sessionStorage when specified', () => {
      mockSessionStorage.removeItem.mockReturnValue(undefined)
      
      const result = removeStorage('test-key', 'session')
      
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('test-key')
      expect(result).toBe(true)
    })

    it('should return false when storage is null', () => {
      Object.defineProperty(window, 'localStorage', {
        value: null,
        writable: true,
      })
      
      const result = removeStorage('test-key')
      
      expect(result).toBe(false)
    })

    it('should return false when storage throws error', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      const result = removeStorage('test-key')
      
      expect(result).toBe(false)
    })
  })
})
