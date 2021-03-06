# Generated by Django 3.1.6 on 2021-02-09 12:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='light',
            name='brightness',
            field=models.PositiveSmallIntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='thermostat',
            name='actual_temperature',
            field=models.SmallIntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='thermostat',
            name='temperature_set',
            field=models.SmallIntegerField(blank=True),
        ),
    ]
