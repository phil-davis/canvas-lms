/*
 * Copyright (C) 2016 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import CalendarEvent from '../CalendarEvent'

let calendarEvent

const getFakeChildEvents = () => [
  {user: {sortable_name: 'Stark, Tony'}},
  {user: {sortable_name: 'Parker, Peter'}},
  {user: {sortable_name: 'Rogers, Steve'}},
]

describe('CommonEvent.CalendarEvent', () => {
  beforeEach(() => {
    const data = {
      child_events: [],
    }
    const contexts = ['course_1']
    calendarEvent = new CalendarEvent(data, contexts)
  })

  afterEach(() => {
    calendarEvent = null
  })

  test('Constructor sets reservedUsers from child_events limited to 5 and joined by "; "', () => {
    const data = {
      child_events: getFakeChildEvents().concat([
        {user: {sortable_name: 'Banner, Bruce'}},
        {user: {sortable_name: 'Lang, Scott'}},
      ]),
    }
    calendarEvent = new CalendarEvent(data, ['course_1'])
    const expected = 'Banner, Bruce; Lang, Scott; Parker, Peter; Rogers, Steve; Stark, Tony'
    expect(calendarEvent.reservedUsers).toBe(expected)
  })

  test('Constructor sets reservedUsers from child_events limited to 5 and joined by "; " with "and more..." if more than 5', () => {
    const data = {
      child_events: getFakeChildEvents().concat([
        {user: {sortable_name: 'Banner, Bruce'}},
        {user: {sortable_name: 'Lang, Scott'}},
        {user: {sortable_name: 'Barton, Clint'}},
      ]),
    }
    calendarEvent = new CalendarEvent(data, ['course_1'])
    const expected =
      'Banner, Bruce; Barton, Clint; Lang, Scott; Parker, Peter; Rogers, Steve; and more...'
    expect(calendarEvent.reservedUsers).toBe(expected)
  })

  test('calculateAppointmentGroupEventStatus returns number of available slots string when more than 0 and none are reserved', () => {
    calendarEvent.calendarEvent.available_slots = 20
    expect(calendarEvent.calculateAppointmentGroupEventStatus()).toBe('20 Available')
  })

  test('calculateAppointmentGroupEventStatus returns "X more available" when there are some reserved and some open', () => {
    calendarEvent.calendarEvent.child_events = getFakeChildEvents()
    calendarEvent.calendarEvent.available_slots = 17
    expect(calendarEvent.calculateAppointmentGroupEventStatus()).toBe('17 more available')
  })

  test('calculateAppointmentGroupEventStatus gives "Filled" string when 0 available_slots', () => {
    calendarEvent.calendarEvent.available_slots = 0
    expect(calendarEvent.calculateAppointmentGroupEventStatus()).toBe('Filled')
  })

  test('calculateAppointmentGroupEventStatus gives "Reserved" string when reserved', () => {
    calendarEvent.calendarEvent.reserved = true
    expect(calendarEvent.calculateAppointmentGroupEventStatus()).toBe('Reserved')
  })

  test('calculateAppointmentGroupEventStatus gives "Reserved" string when there is an appointment_group_url and parent_event_id', () => {
    calendarEvent.calendarEvent.reserved = false
    calendarEvent.calendarEvent.appointment_group_url = 1
    calendarEvent.calendarEvent.parent_event_id = 30
    expect(calendarEvent.calculateAppointmentGroupEventStatus()).toBe('Reserved')
  })

  test('consideredReserved returns true when reserve should be shown', () => {
    calendarEvent.calendarEvent.reserved = true
    expect(calendarEvent.consideredReserved()).toBe(true)

    calendarEvent.calendarEvent.reserved = false
    calendarEvent.calendarEvent.appointment_group_url = 1
    calendarEvent.calendarEvent.parent_event_id = 30
    expect(calendarEvent.consideredReserved()).toBeTruthy()
  })
})
