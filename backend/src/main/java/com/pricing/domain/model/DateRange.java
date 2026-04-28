package com.pricing.domain.model;

import java.time.LocalDateTime;

public record DateRange(LocalDateTime startDate, LocalDateTime endDate) {
    public boolean contains(LocalDateTime date) {
        return false;
    }
}
