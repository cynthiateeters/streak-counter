import { JSDOM } from "jsdom";
import { streakCounter } from "../src/index";
import { formattedDate } from '../src/utils'

describe('streakCounter', () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    const mockJSDom = new JSDOM('', { url: "https://localhost" })
    mockLocalStorage = mockJSDom.window.localStorage;

        // Use date in past so it’s always the same
    const date = new Date('12/12/2021')

    const streak = {
      currentCount: 1,
      startDate: formattedDate(date),
      lastLoginDate: formattedDate(date),
    }

    mockLocalStorage.setItem('streak', JSON.stringify(streak))
  });
  afterEach(() => {
    mockLocalStorage.clear()
  })

  it('should return a streak object with currentCount, startDate and lastLoginDate', () => {
    // const mockLocalStorage = ''
    const date = new Date()
    const streak = streakCounter(mockLocalStorage, date)

    // Should match the dates used to set up the tests
    expect(streak.currentCount).toBe(1)
    expect(streak.startDate).toBe(formattedDate(date))
    expect(streak.lastLoginDate).toBe(formattedDate(date))

  })

  it('should increment the streak', () => {
  // It should increment because this is the day after
  // the streak started and a streak is days in a row.
  const date = new Date('12/13/2021')
    const streak = streakCounter(mockLocalStorage, date)
  expect(streak.currentCount).toBe(2)
  })

  it('should not increment the streak when login days not consecutive', () => {
  // It should not increment because this is two days after
  // the streak started and the days aren't consecutive.
  const date = new Date('12/14/2021')
  const streak = streakCounter(mockLocalStorage, date)

  expect(streak.currentCount).toBe(1)
  })

  it('should save the incremented streak to localStorage', () => {
  const key = 'streak'
  const date = new Date('12/13/2021')
  // Call it once so it updates the streak
  streakCounter(mockLocalStorage, date)

  const streakAsString = mockLocalStorage.getItem(key)
  // Normally you should wrap in try/catch in case the JSON is bad
  // but since we authored it, we can skip here
  const streak = JSON.parse(streakAsString || '')

  expect(streak.currentCount).toBe(2)
  })

  it('should reset if not consecutive', () => {
  const date = new Date('12/13/2021')
  const streak = streakCounter(mockLocalStorage, date)

  expect(streak.currentCount).toBe(2)

  // Skip a day and break the streak
  const dateUpdated = new Date('12/15/2021')
  const streakUpdated = streakCounter(mockLocalStorage, dateUpdated)

  expect(streakUpdated.currentCount).toBe(1)
  })

  it('should not reset the streak for same-day login', () => {
  const date = new Date('12/13/2021')
  // Call it once so it updates the streak

  // Simulate same-day login
  const dateUpdated = new Date('12/13/2021')
  const streakUpdated = streakCounter(mockLocalStorage, dateUpdated)

  expect(streakUpdated.currentCount).toBe(2)
})

  // it('should return a streak starting at 1 and keep track of lastLoginDate', () => {
  //   const date = new Date()
  //   const streak = streakCounter(mockLocalStorage, date)

  //   const dateFormatted = formattedDate(date)

  //   expect(streak.currentCount).toBe(1)
  //   expect(streak.lastLoginDate).toBe(dateFormatted)
  // })

  // it('should store the streak in localStorage', () => {
  //   const date = new Date()
  //   const key = 'streak'
  //   streakCounter(mockLocalStorage, date)

  //   const streakAsString = mockLocalStorage.getItem(key)
  //   expect(streakAsString).not.toBeNull()
  // })
  // end
})

