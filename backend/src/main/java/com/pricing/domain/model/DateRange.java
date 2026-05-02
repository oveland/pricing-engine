package com.pricing.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;

public record DateRange(LocalDateTime startDate, LocalDateTime endDate) {
    public DateRange {
        Objects.requireNonNull(startDate, "startDate must not be null");
        Objects.requireNonNull(endDate, "endDate must not be null");
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("startDate must be before or equal to endDate");
        }
    }

    public boolean contains(final LocalDateTime date) {
        return !date.isBefore(startDate) && !date.isAfter(endDate);
    }
}
