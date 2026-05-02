package com.pricing.infrastructure.adapter.input.rest;

public record ErrorResponseDto(int status, String error, String message, String timestamp) {}
