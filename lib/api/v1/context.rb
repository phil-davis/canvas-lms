# frozen_string_literal: true

#
# Copyright (C) 2011 - present Instructure, Inc.
#
# This file is part of Canvas.
#
# Canvas is free software: you can redistribute it and/or modify it under
# the terms of the GNU Affero General Public License as published by the Free
# Software Foundation, version 3 of the License.
#
# Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
# A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
# details.
#
# You should have received a copy of the GNU Affero General Public License along
# with this program. If not, see <http://www.gnu.org/licenses/>.
#

module Api::V1::Context
  def context_data(obj, use_effective_code: false)
    if obj.try(:context_type).present?
      context_type = obj.context_type
      id = obj.context_id
    elsif obj.try(:context_code).present?
      context_type, id = obj.context_code.split("_", 2)
    elsif obj.try(:context).present?
      context_type = obj.context.class.to_s
      id = obj.context.id
    else
      return {}
    end
    if obj.try(:effective_context_code) && use_effective_code
      context_type, _, id = obj.effective_context_code.rpartition("_")
    end
    {
      "context_type" => context_type.camelcase,
      "#{context_type.underscore}_id" => id.to_i,
    }
  end
end
